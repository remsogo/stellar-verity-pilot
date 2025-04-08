
-- Drop function if it exists (using proper syntax)
DROP FUNCTION IF EXISTS public.get_user_projects();

-- Create a function to get user projects without infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_projects()
RETURNS SETOF projects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM projects p
  JOIN project_users pu ON p.id = pu.project_id
  WHERE pu.user_id = auth.uid();
END;
$$;

-- Create a function to safely check project membership
CREATE OR REPLACE FUNCTION public.is_member_of_project(project_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM project_users 
    WHERE project_id = $1 AND user_id = auth.uid()
  );
END;
$$;
