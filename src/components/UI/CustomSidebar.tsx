
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { ChevronRight, CircleUser, ClipboardList, Home, LogOut, Rocket, History, Bug, Users, Settings } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { useLogout } from "@/hooks/use-logout";

export const CustomSidebar = () => {
  const sidebar = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { selectedProjectId } = useSelectedProject();
  const { logout } = useLogout();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: Home, requiresProject: true },
    { name: "Test Cases", path: "/test-cases", icon: ClipboardList, requiresProject: true },
    { name: "Executions", path: "/test-executions", icon: History, requiresProject: true },
    { name: "Defects", path: "/defects", icon: Bug, requiresProject: true },
    { name: "Projects", path: "/projects", icon: Users, requiresProject: false },
    { name: "Parameters", path: "/parameters", icon: Settings, requiresProject: true },
  ];

  return (
    <Sidebar 
      className="border-r border-border/40 bg-card/80 backdrop-blur-lg" 
    >
      <SidebarHeader className="px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Rocket size={24} className="text-primary" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-purple-300 bg-clip-text text-transparent">
            TestMaster
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isDisabled = item.requiresProject && !selectedProjectId;
            const isActive = location.pathname === item.path;
            
            return (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        asChild={!isDisabled}
                        className={`w-full justify-start gap-3 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isDisabled}
                      >
                        {isDisabled ? (
                          <div className="flex items-center">
                            <item.icon size={16} />
                            <span className="ml-3">{item.name}</span>
                          </div>
                        ) : (
                          <Link to={item.path}>
                            <item.icon size={16} />
                            <span>{item.name}</span>
                            {isActive && <ChevronRight size={16} className="ml-auto" />}
                          </Link>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isDisabled && (
                    <TooltipContent>
                      <p>Select a project first</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/20">
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <CircleUser size={24} className="text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none truncate max-w-40">
                {user?.email || 'User'}
              </span>
              <span className="text-xs text-muted-foreground">
                QA Engineer
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between px-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
