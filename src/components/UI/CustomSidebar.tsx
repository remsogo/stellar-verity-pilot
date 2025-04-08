
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  CircleUserRound,
  Home,
  FileText,
  Settings,
  ListChecks,
  BarChart2,
  PlayCircle,
  LogOut,
  BugPlay,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

export const CustomSidebar = () => {
  const [activeItem, setActiveItem] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const path = location.pathname.split("/")[1] || "dashboard";
    setActiveItem(path);
  }, [location]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      onClick: () => navigate("/"),
    },
    {
      id: "test-cases",
      label: "Test Cases",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => navigate("/test-cases"),
    },
    {
      id: "test-executions",
      label: "Executions",
      icon: <PlayCircle className="h-4 w-4" />,
      onClick: () => navigate("/test-executions"),
    },
    {
      id: "defects",
      label: "Defects",
      icon: <BugPlay className="h-4 w-4" />,
      onClick: () => navigate("/defects"),
    },
    {
      id: "requirements",
      label: "Requirements",
      icon: <ListChecks className="h-4 w-4" />,
      onClick: () => navigate("/requirements"),
    },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChart2 className="h-4 w-4" />,
      onClick: () => navigate("/reports"),
    },
  ];

  return (
    <Sidebar
      id="sidebar"
      className="border-r h-screen w-64 flex flex-col justify-between"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 pt-6 pb-6 flex items-center gap-2">
          <div>
            <div className="font-semibold text-lg">TestMaster</div>
            <div className="text-xs opacity-50">Test Management System</div>
          </div>
        </div>

        <div className="px-2 mb-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={toggleModal}
          >
            <Search className="h-4 w-4 mr-2" />
            Search...
          </Button>
        </div>

        <div className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={item.onClick}
              data-testid={`sidebar-${item.id}`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="mt-auto">
          <div className="space-y-1 px-2 pb-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2">Settings</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
            <div className="flex justify-center my-2">
              <ThemeToggle />
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <CircleUserRound className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">User Profile</div>
                <div className="text-xs text-muted-foreground">
                  user@testmaster.app
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <SearchBar onClose={toggleModal} />}
    </Sidebar>
  );
};
