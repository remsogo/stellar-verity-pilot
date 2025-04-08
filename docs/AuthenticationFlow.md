
# Authentication Flow Documentation

## Overview

The TestNexus application uses Supabase Authentication for user management. This document outlines the authentication flow and key components used to implement it.

## Authentication Architecture

### Components:

1. **AuthContext (`src/context/AuthContext.tsx`)**
   - Provides global authentication state
   - Manages session information
   - Handles auth state changes
   - Provides session refresh functionality

2. **AuthService (`src/components/Auth/AuthService.ts`)**
   - Contains core authentication functions:
     - `loginUser`: Handles user login
     - `signupUser`: Handles user registration
     - `checkAuthSession`: Verifies current authentication
     - `logoutUser`: Handles user logout

3. **Auth Page (`src/pages/Auth.tsx`)**
   - Presents login and signup interfaces
   - Manages form state and submission
   - Handles redirects based on authentication status

4. **Protected Route (`src/components/Routes/ProtectedRoute.tsx`)**
   - Guards routes that require authentication
   - Handles project selection requirements
   - Manages redirects for unauthorized access

5. **useLogout Hook (`src/hooks/use-logout.ts`)**
   - Provides a reusable logout function
   - Handles cleanup of project selection
   - Manages navigation after logout

## Authentication Flow

1. **Initial App Load**
   - The `AuthProvider` checks for an existing session
   - If a session exists, the user is considered authenticated
   - The session state is made available throughout the app via the `useAuth` hook

2. **Login Flow**
   - User enters credentials in the login form
   - `loginUser` function authenticates via Supabase
   - On success:
     - Session is established
     - User is redirected to the projects page
     - Project selection is refreshed

3. **Signup Flow**
   - User enters details in the signup form
   - `signupUser` function registers the user via Supabase
   - Creates a user profile in the database
   - User needs to confirm email before logging in
   - UI switches to login tab after successful registration

4. **Route Protection**
   - `ProtectedRoute` component wraps all secure routes
   - Checks authentication status via `useAuth` hook
   - Redirects to `/auth` if user is not authenticated
   - Handles project selection requirements for specific routes

5. **Logout**
   - `useLogout` hook provides a consistent logout experience
   - Clears selected project
   - Refreshes authentication session
   - Redirects to authentication page

## State Management

- Authentication state is managed by the `AuthContext`
- Project selection is managed by `useSelectedProject` (Zustand store)
- These state providers are accessible throughout the application

## Security Considerations

- Authentication state is managed server-side via Supabase sessions
- Protected routes ensure unauthorized users cannot access app features
- Email confirmation is required for new accounts
- Password strength validation is implemented by Supabase

## Debugging

- Console logs are added in key authentication points for debugging
- Auth state changes are tracked and logged
- Route protection logic includes detailed logging

