
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
  created_at: string;
  updated_at: string;
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
  email: string;
  role: ProjectRole;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
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
