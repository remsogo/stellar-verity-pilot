
# Database Documentation

Welcome to the TestMaster database documentation. This set of documents provides comprehensive information about the database structure, relationships, security model, and data flow.

## Contents

1. [Database Overview](./Overview.md) - Introduction and high-level architecture
2. [Database Tables](./Tables.md) - Detailed table definitions
3. [Database Functions](./Functions.md) - SQL functions and procedures
4. [Entity Relationships](./Relationships.md) - Relationships between database entities
5. [Security Model](./Security.md) - Row Level Security and access control
6. [Data Flow](./DataFlow.md) - Typical data flow patterns

## Database Schema

The TestMaster application uses a PostgreSQL database powered by Supabase. The schema consists of multiple tables organized around projects, test cases, test plans, executions, and defects.

### Key Features

- **Project-based organization** with role-based access control
- **Comprehensive test management** including test cases, steps, and executions
- **Defect tracking** integrated with test executions
- **Parameter system** for flexible configuration
- **Strong security model** using Row Level Security

## Database Diagram

For a visual representation of the database schema, see the Entity Relationships document.

## Best Practices

When working with the database, follow these best practices:

1. **Always use the API** rather than direct database access
2. **Respect security boundaries** defined by projects
3. **Use transactions** for operations that modify multiple tables
4. **Consider performance** for operations that might be slow
5. **Use proper indexing** for frequently queried columns

## Database Migration

Database migrations are managed through SQL files in the `supabase/migrations` directory. Each migration should:

1. Be atomic and focused
2. Include proper error handling
3. Be backward compatible when possible
4. Include comments explaining the purpose

## Further Reading

- [Authentication Flow](../AuthenticationFlow.md) - Details on the authentication flow
- [Supabase Documentation](https://supabase.com/docs) - Official Supabase documentation
