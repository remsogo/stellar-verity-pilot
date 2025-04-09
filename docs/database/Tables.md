
# Database Tables

This document details the tables in the TestMaster application database.

## Projects and Users

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
| avatar_url | text | Profile picture URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

User profiles store additional information about authenticated users and enables system-wide functionality.

## Test Management

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

## Test Planning and Execution

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

## Defect Tracking

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

## Test Organization

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

## Requirements Management

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

## Parameter Management

### System Parameters

```
Table: system_parameters
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Parameter name |
| description | text | Parameter description |
| param_type | text | Parameter type |
| default_value | jsonb | Default value |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Project Parameters

```
Table: project_parameters
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | Reference to projects.id |
| name | text | Parameter name |
| description | text | Parameter description |
| param_type | text | Parameter type |
| default_value | jsonb | Default value |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Parameter Values

```
Table: parameter_values
```

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| context_type | text | Context type (system, project, test_case) |
| entity_id | uuid | ID of the entity this value belongs to |
| parameter_id | uuid | Reference to parameter definition |
| value | jsonb | Parameter value |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

## File Attachments

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
