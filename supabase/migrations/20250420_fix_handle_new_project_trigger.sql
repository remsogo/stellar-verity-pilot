
-- Update the handle_new_project function to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Direct insert into project_users bypassing RLS
  INSERT INTO public.project_users (project_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$;

-- Make sure the trigger is properly set up
DROP TRIGGER IF EXISTS handle_new_project_trigger ON public.projects;
CREATE TRIGGER handle_new_project_trigger
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_project();

-- Fix RLS policies on project_users to avoid infinite recursion
ALTER TABLE public.project_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;

-- Create policy for select on project_users
CREATE POLICY "Users can view project users"
  ON public.project_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_users pu
      WHERE pu.project_id = project_id AND pu.user_id = auth.uid()
    )
  );

-- Create policy for insert on project_users
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

-- Create policy for update on project_users
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

-- Create policy for delete on project_users
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
