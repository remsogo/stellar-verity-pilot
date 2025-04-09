
# Database Security Model

This document explains the security model implemented in the TestMaster application database.

## Row Level Security (RLS)

Most tables have Row Level Security policies applied that restrict access based on project membership. These policies ensure that users can only see and manipulate data for projects they are members of.

### Security Principles

1. Users can only access data for projects they're members of
2. Users with admin/owner roles can modify resources
3. Users with viewer roles can only read data
4. Data is isolated between different projects

### RLS Implementation Pattern

The general pattern for RLS policies is:

```sql
-- Example: Read access policy
CREATE POLICY "Users can view their project's items" 
ON table_name
FOR SELECT
USING (public.is_member_of_project(project_id));

-- Example: Write access policy
CREATE POLICY "Admins can modify their project's items" 
ON table_name
FOR UPDATE
USING (public.is_project_admin(project_id, auth.uid()));
```

### Security Definer Functions

Security definer functions are used to prevent infinite recursion in RLS policies, which could occur when a policy attempts to query the same table it's protecting.

Key security functions:

1. **is_member_of_project(project_id UUID)**
   - Checks if the current user is a member of a project
   - Used in SELECT policies

2. **is_project_admin(project_id UUID, user_id UUID)**
   - Checks if a user has admin or owner role in a project
   - Used in INSERT/UPDATE/DELETE policies

These functions are defined with `SECURITY DEFINER`, allowing them to bypass RLS when performing their checks.

## Role-Based Access Control

The application implements role-based access control through the `project_users` table, with roles:

1. **owner** - Full control over the project, including deletion and ownership transfer
2. **admin** - Can manage users and project settings
3. **editor** - Can create and modify test cases and other entities
4. **viewer** - Read-only access to project data

Roles are enforced at:
- Database level (through RLS policies)
- Application level (through permission checks)

## Authentication Integration

The authentication system is integrated with Supabase Auth, using:

1. User profiles linked to auth.users
2. Project membership to control access
3. Secure session management

## API Security Layers

Security is implemented at multiple layers:

1. **Database Layer** - RLS policies control direct access
2. **API Layer** - Additional permission checks in edge functions
3. **Client Layer** - UI elements are conditionally rendered based on permissions

## Public vs. Private Data

Most data is private and protected by RLS, with a few exceptions:

1. Public project information (name, description)
2. System parameters accessible to all authenticated users

## Security Best Practices

The database security implementation follows these best practices:

1. **Principle of Least Privilege** - Users only have access to what they need
2. **Defense in Depth** - Multiple security layers
3. **Proper Isolation** - Data is isolated between projects
4. **Security by Default** - RLS enabled on all tables

## User Authentication Flow

The authentication flow is described in detail in the [Authentication Flow Documentation](../AuthenticationFlow.md).
