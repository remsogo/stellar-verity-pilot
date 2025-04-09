
-- Fix the handle_new_project function to use add_project_owner
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use the security definer function add_project_owner
  -- which bypasses RLS completely
  PERFORM public.add_project_owner(NEW.id, auth.uid());
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to add project owner: %', SQLERRM;
END;
$$;

-- Create a function for checking project membership securely
-- without causing RLS recursion
CREATE OR REPLACE FUNCTION public.is_project_member_secure(p_project_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_users 
    WHERE project_id = p_project_id AND user_id = auth.uid()
  );
END;
$$;

-- Create a function for checking project admin status securely
CREATE OR REPLACE FUNCTION public.is_project_admin_secure(p_project_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_users 
    WHERE project_id = p_project_id AND user_id = auth.uid() AND (role = 'admin' OR role = 'owner')
  );
END;
$$;

-- Fix the project_users RLS policies to prevent recursive queries
ALTER TABLE public.project_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;

-- Create improved policies using EXISTS instead of recursive functions
DROP POLICY IF EXISTS "Users can view project users" ON public.project_users;
CREATE POLICY "Users can view project users"
  ON public.project_users 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.project_users pu
      WHERE pu.project_id = project_id AND pu.user_id = auth.uid()
    )
  );

-- Write/edit access policies
DROP POLICY IF EXISTS "Project admins can add users" ON public.project_users;
CREATE POLICY "Project admins can add users"
  ON public.project_users 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_users pu
      WHERE pu.project_id = project_id AND pu.user_id = auth.uid() 
      AND (pu.role = 'admin' OR pu.role = 'owner')
    )
  );

DROP POLICY IF EXISTS "Project admins can update users" ON public.project_users;
CREATE POLICY "Project admins can update users"
  ON public.project_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_users pu
      WHERE pu.project_id = project_id AND pu.user_id = auth.uid() 
      AND (pu.role = 'admin' OR pu.role = 'owner')
    )
  );

DROP POLICY IF EXISTS "Project admins can delete users" ON public.project_users;
CREATE POLICY "Project admins can delete users"
  ON public.project_users 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_users pu
      WHERE pu.project_id = project_id AND pu.user_id = auth.uid() 
      AND (pu.role = 'admin' OR pu.role = 'owner')
    )
  );

-- Create a helper function to drop policies if they exist
CREATE OR REPLACE FUNCTION public.drop_policy_if_exists(
  policy_name TEXT,
  table_name TEXT
) RETURNS void AS $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Failed to drop policy %: %', policy_name, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create a function that can be called from edge functions to fix policies
CREATE OR REPLACE FUNCTION public.create_project_users_policy()
RETURNS void AS $$
BEGIN
  -- Create the non-recursive policy
  EXECUTE $policy$
    CREATE POLICY "Users can view project users" 
    ON public.project_users 
    FOR SELECT 
    USING (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.project_users pu
        WHERE pu.project_id = project_id AND pu.user_id = auth.uid()
      )
    )
  $policy$;
END;
$$ LANGUAGE plpgsql;
