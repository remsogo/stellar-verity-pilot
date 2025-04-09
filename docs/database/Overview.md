
# Database Overview

## Introduction

This document provides an overview of the database structure for the TestMaster application. The application uses a Supabase PostgreSQL database to manage test cases, executions, defects, and related entities within a project-based organization.

## Core Design Principles

1. **Project-Centric Organization**: All testing artifacts belong to specific projects
2. **User-based Access Control**: Row Level Security (RLS) ensures users can only access data from projects they're members of
3. **Role-Based Permissions**: Different user roles (owner, admin, editor, viewer) have different levels of access
4. **Comprehensive Traceability**: Relationships between entities enable tracing from requirements to test cases to executions to defects

## Main Entity Types

The database is organized around these primary entities:

1. **Projects** - The top-level organizational units
2. **Test Cases** - Individual test scenarios with steps and expected results
3. **Test Plans** - Collections of test cases for execution 
4. **Test Executions** - Records of test case runs with results
5. **Defects** - Issues found during testing

## Security Model

The application implements Row Level Security (RLS) at the database level, with policies that:

1. Restrict data access to project members
2. Control write operations based on user roles
3. Provide appropriate isolation between projects

Security definer functions like `is_member_of_project()` and `get_user_projects()` support these policies while preventing infinite recursion.

## Key Database Functions

The system includes several SQL functions to support operations:

1. **Project Management**: Functions for user management and project access
2. **Test Cycle Management**: Functions for managing test cycles and retrieving statistics
3. **Parameter Management**: Functions for system and project-level parameters

See [Database Functions](./Functions.md) for more details.
