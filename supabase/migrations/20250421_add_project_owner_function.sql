
-- Create a function to add a project owner without triggering RLS policies
CREATE OR REPLACE FUNCTION public.add_project_owner(project_id UUID, owner_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Direct insert bypassing RLS
  INSERT INTO public.project_users (project_id, user_id, role)
  VALUES (project_id, owner_id, 'owner');
END;
$$;

-- Make sure our policies are clean and correct
DROP POLICY IF EXISTS "Users can view their projects' members" ON public.project_users;
DROP POLICY IF EXISTS "Admins can add project members" ON public.project_users;
DROP POLICY IF EXISTS "Admins can update project members" ON public.project_users;
DROP POLICY IF EXISTS "Admins can delete project members" ON public.project_users;

-- Recreate policies that won't cause recursion issues
CREATE POLICY "Users can view their projects' members"
  ON public.project_users 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 
      FROM public.project_users 
      WHERE project_id = project_users.project_id 
      AND user_id = auth.uid()
    )
  );

-- Admin policies using EXISTS instead of recursive policies
CREATE POLICY "Admins can add project members"
  ON public.project_users 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.project_users 
      WHERE project_id = project_users.project_id 
      AND user_id = auth.uid() 
      AND (role = 'admin' OR role = 'owner')
    )
  );

CREATE POLICY "Admins can update project members"
  ON public.project_users 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.project_users 
      WHERE project_id = project_users.project_id 
      AND user_id = auth.uid() 
      AND (role = 'admin' OR role = 'owner')
    )
  );

CREATE POLICY "Admins can delete project members"
  ON public.project_users 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.project_users 
      WHERE project_id = project_users.project_id 
      AND user_id = auth.uid() 
      AND (role = 'admin' OR role = 'owner')
    )
  );
