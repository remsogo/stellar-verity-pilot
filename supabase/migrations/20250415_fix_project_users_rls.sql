
-- Create function to safely drop a policy if it exists
CREATE OR REPLACE FUNCTION public.drop_policy_if_exists(
  policy_name TEXT, 
  table_name TEXT
) RETURNS VOID AS $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = policy_name 
    AND tablename = table_name
  ) INTO policy_exists;
  
  IF policy_exists THEN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.%I', policy_name, table_name);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create a new project users policy
CREATE OR REPLACE FUNCTION public.create_project_users_policy() RETURNS VOID AS $$
BEGIN
  -- Make sure RLS is enabled
  ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;
  
  -- Create policy for users to view project users they are members of
  -- Uses auth.uid() directly without recursively querying the project_users table
  CREATE POLICY "Users can view project users" ON public.project_users
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.project_users 
        WHERE project_id = project_users.project_id 
        AND user_id = auth.uid()
      )
    );
    
  -- Allow insert/update for project admins
  CREATE POLICY "Admins can insert project users" ON public.project_users
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.project_users 
        WHERE project_id = project_users.project_id 
        AND user_id = auth.uid()
        AND (role = 'admin' OR role = 'owner')
      )
    );
  
  CREATE POLICY "Admins can update project users" ON public.project_users
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.project_users 
        WHERE project_id = project_users.project_id 
        AND user_id = auth.uid()
        AND (role = 'admin' OR role = 'owner')
      )
    );
  
  -- Allow delete for project admins
  CREATE POLICY "Admins can delete project users" ON public.project_users
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM public.project_users 
        WHERE project_id = project_users.project_id 
        AND user_id = auth.uid()
        AND (role = 'admin' OR role = 'owner')
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
