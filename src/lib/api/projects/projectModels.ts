
import { ProjectRole } from '@/integrations/supabase/project-types';
import { Project } from '@/types/project';

/**
 * Project user model representing a member of a project
 */
export interface ProjectUser {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  added_at: string;
}

/**
 * Project with members extended model
 */
export interface ProjectWithMembers extends Project {
  members: {
    id: string;
    email: string;
    name?: string;
    role: ProjectRole;
  }[];
}

/**
 * Project invitation model
 */
export interface ProjectInvitation {
  id: string;
  project_id: string;
  invited_email: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'rejected';
  token: string;
  created_at: string;
  expires_at: string | null;
}

/**
 * Project user data returned from get_project_users RPC
 */
export interface ProjectUserData {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: ProjectRole;
}
