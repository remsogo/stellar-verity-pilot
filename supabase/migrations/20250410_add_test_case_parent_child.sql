
-- Add parent-child relationship columns to test_cases table
ALTER TABLE test_cases 
ADD COLUMN is_parent BOOLEAN DEFAULT FALSE,
ADD COLUMN parent_id UUID REFERENCES test_cases(id) NULL;

-- Create an index on parent_id for faster queries
CREATE INDEX idx_test_cases_parent_id ON test_cases(parent_id);

-- Update the types in the database with these new fields
-- This ensures the database enforces the expected data structure
COMMENT ON COLUMN test_cases.is_parent IS 'Indicates whether this test case is a parent test';
COMMENT ON COLUMN test_cases.parent_id IS 'References the parent test case if this is a child test';
