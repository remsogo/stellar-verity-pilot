
-- Create function to get project IDs for the current user
CREATE OR REPLACE FUNCTION public.get_user_projects()
RETURNS SETOF uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT project_id
  FROM project_users
  WHERE user_id = auth.uid();
END;
$$;
