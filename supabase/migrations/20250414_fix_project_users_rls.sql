
-- Create a new function to get project users
CREATE OR REPLACE FUNCTION public.get_project_users(p_project_id uuid)
RETURNS TABLE (id uuid, user_id uuid, email text, full_name text, role text) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pu.id,
    pu.user_id,
    up.email,
    up.full_name,
    pu.role
  FROM 
    project_users pu
  LEFT JOIN
    user_profiles up ON pu.user_id = up.auth_id
  WHERE 
    pu.project_id = p_project_id;
END;
$$;
