
-- Create an admin function that can run arbitrary SQL and return results
-- Use with caution - only called from trusted edge functions
CREATE OR REPLACE FUNCTION public.admin_query_with_return(query_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_json TEXT;
BEGIN
  -- Execute the query and format the results as JSON
  EXECUTE 'SELECT json_agg(t) FROM (' || query_text || ') t' INTO result_json;
  RETURN result_json;
END;
$$;

-- Grant access to the function only to authenticated users
REVOKE ALL ON FUNCTION public.admin_query_with_return(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_query_with_return(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_query_with_return(TEXT) TO service_role;
