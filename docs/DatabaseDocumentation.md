# Database Documentation

## Overview

This document provides comprehensive information about the database structure for the test management application. It covers tables, relationships, and Row Level Security (RLS) policies that control data access.

## Database Schema

The application uses a Supabase PostgreSQL database with the following main entities:

### Core Entities

1. **Projects** - The top-level organizational units
2. **Test Cases** - Individual test scenarios
3. **Test Plans** - Collections of test cases for execution 
4. **Test Executions** - Records of test case runs
5. **Defects** - Issues found during testing

## Tables and Relationships

### Projects

```
Table: projects
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Project name |
| description | text | Optional project description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

The `projects` table is the foundation of the application. All other entities are associated with a specific project.

### Project Users

```
Table: project_users
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | Reference to projects.id |
| user_id | uuid | Reference to auth.users.id |
| role | text | User role in the project (owner, admin, editor, viewer) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

This junction table manages the many-to-many relationship between users and projects, including role-based permissions. The system supports four distinct roles:
- **owner**: Full control over the project, including deletion
- **admin**: Can manage users and project settings
- **editor**: Can create and modify test cases and other project entities
- **viewer**: Read-only access to project data

### Test Cases

```
Table: test_cases
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Test case title |
| description | text | Detailed description |
| project_id | uuid | Reference to projects.id |
| author | text | Creator of the test case |
| status | text | Status (draft, active, deprecated) |
| priority | text | Priority level |
| automated | boolean | Whether the test is automated |
| data_driven | boolean | Whether the test uses data sets |
| test_data | jsonb | Data sets for data-driven tests |
| is_parent | boolean | Whether it's a parent test case |
| parent_id | uuid | Reference to parent test_case.id |
| preconditions | text | Required preconditions |
| tags | text[] | Array of tags |
| requirements | text[] | Associated requirements |
| estimate_time | integer | Estimated execution time |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Test Steps

```
Table: test_steps
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| test_case_id | uuid | Reference to test_cases.id |
| step_order | integer | Order of the step in the test case |
| description | text | Step description |
| expected_result | text | Expected outcome |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

Test steps represent the individual actions and verifications within a test case.

### Test Plans

```
Table: test_plans
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Test plan title |
| description | text | Plan description |
| project_id | uuid | Reference to projects.id |
| created_by | text | Creator's user ID |
| status | text | Status (draft, active, completed) |
| test_cases | uuid[] | Array of test case IDs |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Test Cycles

```
Table: test_cycles
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Cycle name |
| description | text | Cycle description |
| project_id | uuid | Reference to projects.id |
| test_plan_id | uuid | Reference to test_plans.id |
| status | text | Status (planned, in-progress, completed) |
| start_date | timestamp | Planned start date |
| end_date | timestamp | Planned end date |
| environment | text | Test environment |
| build_version | text | Software build version |
| created_by | text | Creator's user ID |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Test Executions

```
Table: test_executions
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| test_case_id | uuid | Reference to test_cases.id |
| test_cycle_id | uuid | Reference to test_cycles.id (optional) |
| test_suite_id | uuid | Reference to test_suites.id (optional) |
| status | text | Execution status (passed, failed, blocked, pending) |
| executor | text | User who executed the test |
| environment | text | Execution environment |
| start_time | timestamp | Execution start time |
| end_time | timestamp | Execution end time (optional) |
| build_version | text | Software build version |
| notes | text | Execution notes |
| defects | text[] | Array of associated defect IDs |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Execution Steps

```
Table: execution_steps
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| execution_id | uuid | Reference to test_executions.id |
| test_step_id | uuid | Reference to test_steps.id |
| step_order | integer | Order of the step |
| status | text | Step status (passed, failed, skipped) |
| actual_result | text | Actual outcome observed |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Defects

```
Table: defects
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Defect title |
| description | text | Defect description |
| project_id | uuid | Reference to projects.id |
| status | text | Status (open, in-progress, resolved, closed, reopened) |
| severity | text | Severity level (low, medium, high, critical) |
| reporter | text | User who reported the defect |
| assignee | text | User assigned to the defect |
| test_execution_id | uuid | Reference to test_executions.id (optional) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Test Suites

```
Table: test_suites
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Suite name |
| description | text | Suite description |
| project_id | uuid | Reference to projects.id |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Test Suite Cases

```
Table: test_suite_cases
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| test_suite_id | uuid | Reference to test_suites.id |
| test_case_id | uuid | Reference to test_cases.id |
| created_at | timestamp | Creation timestamp |

### Test Collections

```
Table: test_collections
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Collection name |
| description | text | Collection description |
| project_id | uuid | Reference to projects.id |
| is_smart_collection | boolean | Whether it uses dynamic criteria |
| criteria | jsonb | Dynamic selection criteria |
| test_case_ids | uuid[] | Array of test case IDs |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Requirements

```
Table: requirements
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Requirement name |
| description | text | Requirement description |
| project_id | uuid | Reference to projects.id |
| status | text | Status (active, completed, obsolete) |
| priority | text | Priority level |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### User Profiles

```
Table: user_profiles
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| auth_id | uuid | Reference to auth.users.id |
| email | text | User email |
| full_name | text | User's full name |
| role | text | Global system role |
| avatar_url | text | Profile picture URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

User profiles store additional information about authenticated users and enables system-wide functionality.

### Attachments

```
Table: attachments
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| entity_id | uuid | ID of the entity this attachment belongs to |
| entity_type | text | Type of entity (test_case, execution, defect) |
| file_name | text | Original file name |
| file_path | text | Storage path |
| file_type | text | MIME type |
| file_size | integer | File size in bytes |
| uploaded_by | text | User who uploaded the file |
| created_at | timestamp | Upload timestamp |

## Database Functions

### Project Management Functions

1. **get_user_projects()** 
   - Returns all projects the current user has access to
   - Used for project selection and listing
   - Security definer function that prevents RLS recursion

2. **is_member_of_project(project_id UUID)**
   - Checks if the current user is a member of the specified project
   - Returns boolean
   - Used for permission checks
   - Security definer function that prevents RLS recursion

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

### Test Cycle Management Functions

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

## Entity Relationship Diagram

```
projects 1──┐
            │
            │ *
project_users
            │
            │
auth.users 1─┘

projects 1───┐
             │
             │ *
test_cases ◄─┼───┐
         │   │   │
         │   │   │
         │   │   │ *
         │   │   └── test_steps
         │   │
         │   │ *
         └──►test_plans
             │
             │ *
             └── test_cycles
                  │
                  │ *
                  └── test_executions
                        │
                        │ *
                        └── execution_steps
```

## Row Level Security (RLS)

Most tables have Row Level Security policies applied that restrict access based on project membership. These policies ensure that users can only see and manipulate data for projects they are members of.

The general pattern is:
1. Users can see resources for projects they're members of
2. Users with admin/owner roles can modify resources
3. Users with viewer roles can only read data

Security definer functions like `is_member_of_project` and `get_user_projects` are used to prevent infinite recursion in RLS policies, which could occur when a policy attempts to query the same table it's protecting.

## Project User Management

The system provides a complete API for project user management:

1. **getProjectUsers(projectId)** - Gets all users for a specific project
2. **getProjectWithMembers(projectId)** - Gets a project with its member details
3. **addUserToProject(projectId, email, role)** - Adds a user to a project
4. **updateUserRole(projectId, userId, role)** - Updates a user's role in the project
5. **removeUserFromProject(projectId, userId)** - Removes a user from a project
6. **checkUserProjectMembership(projectId)** - Checks if the current user is a member of a project

## Typical Data Flow

1. Create a Project
2. Add Users to the Project with appropriate roles
3. Create Test Cases with Steps
4. Create Test Plans by selecting Test Cases
5. Create Test Cycles based on Test Plans
6. Execute Tests, recording results in Test Executions
7. Create Defects for failed tests
8. Track and resolve Defects

This documentation provides a foundation for understanding the database structure and relationships. Refer to specific code files for implementation details.
