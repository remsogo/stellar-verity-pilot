
// Re-export all project-related functions and models
export * from './projectCore';
export * from './projectUsers';
export * from './projectModels';

// Export a combined API for easier imports
export const ProjectsAPI = {
  getProjects: async () => {
    const { getProjects } = await import('./projectCore');
    return getProjects();
  },
  getProject: async (id: string) => {
    const { getProject } = await import('./projectCore');
    return getProject(id);
  },
  createProject: async (name: string, description?: string) => {
    const { createProject } = await import('./projectCore');
    return createProject(name, description);
  },
  updateProject: async (id: string, updates: { name?: string; description?: string }) => {
    const { updateProject } = await import('./projectCore');
    return updateProject(id, updates);
  },
  deleteProject: async (id: string) => {
    const { deleteProject } = await import('./projectCore');
    return deleteProject(id);
  },
  getProjectUsers: async (projectId: string) => {
    const { getProjectUsers } = await import('./projectUsers');
    return getProjectUsers(projectId);
  },
  getProjectWithMembers: async (projectId: string) => {
    const { getProjectWithMembers } = await import('./projectUsers');
    return getProjectWithMembers(projectId);
  },
  addUserToProject: async (projectId: string, email: string, role: any) => {
    const { addUserToProject } = await import('./projectUsers');
    return addUserToProject(projectId, email, role);
  },
  updateUserRole: async (projectId: string, userId: string, role: any) => {
    const { updateUserRole } = await import('./projectUsers');
    return updateUserRole(projectId, userId, role);
  },
  removeUserFromProject: async (projectId: string, userId: string) => {
    const { removeUserFromProject } = await import('./projectUsers');
    return removeUserFromProject(projectId, userId);
  },
  checkUserProjectMembership: async (projectId: string) => {
    const { checkUserProjectMembership } = await import('./projectUsers');
    return checkUserProjectMembership(projectId);
  }
};
