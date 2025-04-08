
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
          // Check if the user still has access to this project
          const { error } = await supabase
            .from('projects')
            .select('id')
            .eq('id', selectedProjectId)
            .single();
          
          if (error) {
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
