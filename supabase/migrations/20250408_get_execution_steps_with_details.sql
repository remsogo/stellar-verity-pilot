
CREATE OR REPLACE FUNCTION get_execution_steps_with_details(execution_id_param UUID)
RETURNS TABLE (
  id UUID,
  test_step_id UUID,
  execution_id UUID,
  status TEXT,
  actual_result TEXT,
  step_order INTEGER,
  description TEXT,
  expected_result TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    es.id,
    es.test_step_id,
    es.execution_id,
    es.status,
    es.actual_result,
    es.step_order,
    ts.description,
    ts.expected_result
  FROM 
    execution_steps es
  JOIN 
    test_steps ts ON es.test_step_id = ts.id
  WHERE 
    es.execution_id = execution_id_param
  ORDER BY 
    es.step_order ASC;
END;
$$ LANGUAGE plpgsql;
