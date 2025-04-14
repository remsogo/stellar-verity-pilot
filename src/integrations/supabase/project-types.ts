
export type ProjectRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface ProjectMember {
  id: string;
  email: string;
  name?: string;
  role: ProjectRole;
}

export interface ProjectUser {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  added_at: string;
}

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
