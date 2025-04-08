
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
    user_profiles up ON pu.user_id = up.id
  WHERE 
    pu.project_id = p_project_id;
END;
$$;

-- Function to add user to project
CREATE OR REPLACE FUNCTION public.add_user_to_project(
  p_project_id UUID,
  p_user_id TEXT,
  p_role TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result UUID;
BEGIN
  -- In a real app, you would look up the user ID by email first
  -- For simplicity, we're using the p_user_id as both the ID and email
  v_user_id := p_user_id::UUID;
  
  INSERT INTO public.project_users(project_id, user_id, role)
  VALUES (p_project_id, v_user_id, p_role)
  RETURNING id INTO v_result;
  
  RETURN v_result;
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
  WHERE project_id = p_project_id AND user_id = p_user_id;
  
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
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
  WHERE project_id = p_project_id AND user_id = p_user_id;
  
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
