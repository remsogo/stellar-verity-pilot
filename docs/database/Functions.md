
# Database Functions

This document details the SQL functions in the TestMaster application database.

## Project Management Functions

### User and Project Access

1. **get_user_projects()**
   - Returns all projects the current user has access to
   - Used for project selection and listing
   - Security definer function that prevents RLS recursion

   ```sql
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
   ```

2. **is_member_of_project(project_id UUID)**
   - Checks if the current user is a member of the specified project
   - Returns boolean
   - Used for permission checks
   - Security definer function that prevents RLS recursion

   ```sql
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
   ```

3. **is_project_member(project_id UUID, user_id UUID)**
   - Checks if a specific user is a member of a project
   - Returns boolean
   - Used for administrative functions

4. **is_project_admin(project_id UUID, user_id UUID)**
   - Checks if a specific user is an admin of a project
   - Returns boolean
   - Used for administrative functions

5. **get_project_users(p_project_id UUID)**
   - Returns all users who are members of a project
   - Used for user management in projects
   - Returns comprehensive user data including email and roles

6. **handle_new_project()**
   - Automatically adds the creator as an owner when a new project is created
   - Trigger function that runs after project insertion
   - Ensures proper user assignment at project creation

### Project User Management

1. **add_user_to_project(p_project_id UUID, p_user_id TEXT, p_role TEXT)**
   - Adds a user to a project with the specified role
   - Returns the ID of the created project_users record

2. **update_user_role(p_project_id UUID, p_user_id UUID, p_role TEXT)**
   - Updates a user's role in a project
   - Returns boolean indicating success

3. **remove_user_from_project(p_project_id UUID, p_user_id UUID)**
   - Removes a user from a project
   - Returns boolean indicating success

4. **add_project_owner(project_id UUID, owner_id UUID)**
   - Adds an owner to a project
   - Used for project creation and ownership transfer

## Test Cycle Management Functions

1. **get_project_test_cycles(p_project_id UUID)**
   - Returns all test cycles for a project
   - Used for test cycle listing

2. **get_test_cycle_by_id(p_cycle_id UUID)**
   - Returns a specific test cycle
   - Used for test cycle details

3. **create_test_cycle(cycle_data JSONB)**
   - Creates a new test cycle
   - Returns the created test cycle

4. **update_test_cycle(cycle_data JSONB)**
   - Updates an existing test cycle
   - Returns the updated test cycle

5. **delete_test_cycle(p_cycle_id UUID)**
   - Deletes a test cycle
   - Returns void

6. **get_test_cycle_stats(p_cycle_id UUID)**
   - Returns execution statistics for a test cycle
   - Returns JSONB with counts by status

## Parameter Management Functions

1. **get_system_parameters()**
   - Returns all system parameters
   - Used for global application configuration

2. **get_project_parameters(p_project_id UUID)**
   - Returns all parameters for a project
   - Includes security check for project membership

## Execution Functions

1. **get_execution_steps_with_details(execution_id_param UUID)**
   - Returns execution steps with test step details
   - Joins execution_steps with test_steps
   - Used for displaying execution details

## Utility Functions

1. **update_updated_at_column()**
   - Automatically updates the updated_at column on record changes
   - Trigger function used across multiple tables
