
-- Create an admin function that can run arbitrary SQL
-- Use with caution - only called from trusted edge functions
CREATE OR REPLACE FUNCTION public.admin_query(query_text TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE query_text;
END;
$$;

-- Grant access to the function only to authenticated users
REVOKE ALL ON FUNCTION public.admin_query(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_query(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_query(TEXT) TO service_role;
