
-- Function to get project users
CREATE OR REPLACE FUNCTION public.get_project_users(p_project_id UUID)
RETURNS TABLE (id UUID, user_id UUID, email TEXT, full_name TEXT, role TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(
  p_project_id UUID,
  p_user_id UUID,
  p_role TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.project_users
  SET role = p_role
  WHERE project_id = p_project_id AND id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Function to remove user from project
CREATE OR REPLACE FUNCTION public.remove_user_from_project(
  p_project_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.project_users
  WHERE project_id = p_project_id AND id = p_user_id;
  
  RETURN FOUND;
END;
$$;
