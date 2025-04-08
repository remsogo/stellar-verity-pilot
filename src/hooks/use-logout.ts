
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/components/Auth/AuthService";
import { useSelectedProject } from "./use-selected-project";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook for handling user logout across the application
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { resetProjectSelection } = useSelectedProject();
  const { refreshSession } = useAuth();

  const handleLogout = async () => {
    try {
      const success = await logoutUser();
      
      if (success) {
        // Clear any project selections
        resetProjectSelection();
        
        // Refresh auth session to update global state
        await refreshSession();
        
        // Redirect to login
        navigate("/auth", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Error is already handled in logoutUser
    }
  };

  return {
    logout: handleLogout
  };
};
