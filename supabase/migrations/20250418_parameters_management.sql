
-- Create system_parameters table to store global parameters
CREATE TABLE IF NOT EXISTS public.system_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  param_type TEXT NOT NULL,
  default_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name)
);

-- Create project_parameters table for project-specific parameters
CREATE TABLE IF NOT EXISTS public.project_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  param_type TEXT NOT NULL,
  default_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, name)
);

-- Create parameter_values table to store actual values by context
CREATE TABLE IF NOT EXISTS public.parameter_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  parameter_id UUID NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for parameters
ALTER TABLE public.system_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parameter_values ENABLE ROW LEVEL SECURITY;

-- Create get_system_parameters function
CREATE OR REPLACE FUNCTION public.get_system_parameters()
RETURNS SETOF system_parameters
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.system_parameters
  ORDER BY name;
END;
$$;

-- Create get_project_parameters function
CREATE OR REPLACE FUNCTION public.get_project_parameters(p_project_id UUID)
RETURNS SETOF project_parameters
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is member of the project
  IF NOT public.is_member_of_project(p_project_id) THEN
    RAISE EXCEPTION 'Access denied: User is not a member of the project';
  END IF;
  
  RETURN QUERY
  SELECT * FROM public.project_parameters
  WHERE project_id = p_project_id
  ORDER BY name;
END;
$$;

-- Create system_parameters policies
CREATE POLICY "Allow read access to system parameters for authenticated users" 
ON public.system_parameters FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Allow update of system parameters for admins" 
ON public.system_parameters FOR UPDATE 
TO authenticated USING (
  -- Check if user is admin - this would need a function to check admin status
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE auth_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Allow insert of system parameters for admins" 
ON public.system_parameters FOR INSERT 
TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE auth_id = auth.uid() AND role = 'admin'
  )
);

-- Create project_parameters policies
CREATE POLICY "Allow read access to project parameters for project members" 
ON public.project_parameters FOR SELECT 
TO authenticated USING (
  public.is_member_of_project(project_id)
);

CREATE POLICY "Allow update of project parameters for project admins" 
ON public.project_parameters FOR UPDATE 
TO authenticated USING (
  public.is_project_admin(project_id, auth.uid())
);

CREATE POLICY "Allow insert of project parameters for project admins" 
ON public.project_parameters FOR INSERT 
TO authenticated WITH CHECK (
  public.is_project_admin(project_id, auth.uid())
);

-- Create parameter_values policies
CREATE POLICY "Allow read access to parameter values for project members" 
ON public.parameter_values FOR SELECT 
TO authenticated USING (
  (context_type = 'system') OR
  (context_type = 'project' AND public.is_member_of_project(entity_id)) OR
  (context_type = 'test_case' AND EXISTS (
    SELECT 1 FROM public.test_cases tc 
    WHERE tc.id = entity_id AND public.is_member_of_project(tc.project_id)
  ))
);

CREATE POLICY "Allow update of parameter values for related users" 
ON public.parameter_values FOR UPDATE 
TO authenticated USING (
  (context_type = 'system' AND EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE auth_id = auth.uid() AND role = 'admin'
  )) OR
  (context_type = 'project' AND public.is_project_admin(entity_id, auth.uid())) OR
  (context_type = 'test_case' AND EXISTS (
    SELECT 1 FROM public.test_cases tc 
    WHERE tc.id = entity_id AND public.is_member_of_project(tc.project_id)
  ))
);

-- Add updated_at triggers
CREATE TRIGGER update_system_parameters_updated_at
BEFORE UPDATE ON public.system_parameters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_parameters_updated_at
BEFORE UPDATE ON public.project_parameters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parameter_values_updated_at
BEFORE UPDATE ON public.parameter_values
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
