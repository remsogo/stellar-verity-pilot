
# Entity Relationships

This document illustrates the relationships between entities in the TestMaster application database.

## Core Relationships

```
projects 1──┐
            │
            │ *
project_users
            │
            │
auth.users 1─┘

projects 1────┐
              │
              │ *
test_cases ◄──┼────┐
         │    │    │
         │    │    │
         │    │    │ *
         │    │    └─── test_steps
         │    │
         │    │ *
         └───►test_plans
               │
               │ *
               └─── test_cycles
                     │
                     │ *
                     └─── test_executions
                           │
                           │ *
                           └─── execution_steps
```

## Project-Based Organization

All testing artifacts belong to specific projects. The project entity serves as the primary organizational unit, with users having access to projects through project memberships.

### Project Membership

```
projects <──┐
            │
project_users
            │
            └─── user_profiles
```

Project membership is managed through the `project_users` table, which associates users with projects and assigns roles. A user can be a member of multiple projects with different roles.

## Test Case Hierarchy

```
test_cases
    │
    ├─── test_steps
    │
    ├─── (parent_id) test_cases (self-reference)
    │
    └─── test_parameters (via parameter_values)
```

Test cases can have hierarchical relationships through the parent/child structure. Each test case consists of test steps, and can have parameters.

## Test Execution Flow

```
test_plans
    │
    └─── test_cycles
           │
           └─── test_executions
                  │
                  ├─── execution_steps
                  │
                  └─── defects
```

The execution flow begins with test plans, which are executed through test cycles. Test executions record the actual execution of test cases, with detailed results captured in execution steps. Defects can be linked to test executions.

## Test Organization

```
test_collections
    │
    └─── test_cases

test_suites
    │
    └─── test_suite_cases
           │
           └─── test_cases
```

Test cases can be organized through collections and suites. Collections provide a flexible way to group test cases, while suites are more formal structures for test execution.

## Requirements Traceability

```
requirements
    │
    └─── test_cases (via requirements array)
           │
           └─── test_executions
                  │
                  └─── defects
```

Requirements are linked to test cases, which are linked to test executions and defects. This provides full traceability from requirements to defects.

## Parameter Management

```
system_parameters
    │
    └─── parameter_values

project_parameters
    │
    └─── parameter_values
```

Parameters can be defined at the system or project level, with values assigned to specific contexts through parameter_values.
