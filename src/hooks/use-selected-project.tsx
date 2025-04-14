
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { getProject } from "@/lib/api";

interface SelectedProjectState {
  selectedProjectId: string | null;
  isLoading: boolean;
  error: Error | null;
  selectProject: (projectId: string) => void;
  resetProjectSelection: () => void;
  refreshProjectSelection: () => Promise<void>;
}

export const useSelectedProject = create<SelectedProjectState>()(
  persist(
    (set, get) => ({
      selectedProjectId: null,
      isLoading: false,
      error: null,
      
      selectProject: (projectId: string) => {
        set({ selectedProjectId: projectId });
      },
      
      resetProjectSelection: () => {
        set({ selectedProjectId: null });
      },
      
      refreshProjectSelection: async () => {
        const { selectedProjectId } = get();
        
        if (!selectedProjectId) {
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Get the current user
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            set({ selectedProjectId: null, isLoading: false });
            return;
          }
          
          // First check if the user is the owner of the project
          const { data, error } = await supabase
            .from('projects')
            .select('id')
            .eq('id', selectedProjectId)
            .eq('owner_id', userData.user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Error checking project ownership:", error);
            // Don't reset selection on error, let's check project_users
          }
          
          // If user is the owner, they have access
          if (data) {
            set({ isLoading: false });
            return;
          }
          
          // If not the owner, check if they are in project_users
          const { data: projectUserData, error: projectUserError } = await supabase
            .from('project_users')
            .select('project_id')
            .eq('project_id', selectedProjectId)
            .eq('user_id', userData.user.id)
            .maybeSingle();
            
          if (projectUserError || !projectUserData) {
            console.log("User no longer has access to this project, resetting selection");
            set({ selectedProjectId: null, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Error refreshing project selection:", error);
          set({ 
            error: error instanceof Error ? error : new Error("Unknown error"), 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: "selected-project",
      // Only persist the selectedProjectId
      partialize: (state) => ({ selectedProjectId: state.selectedProjectId }),
    }
  )
);
