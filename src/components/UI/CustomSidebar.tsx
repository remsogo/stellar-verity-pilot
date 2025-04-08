
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { ChevronRight, CircleUser, ClipboardList, Home, LogOut, Rocket, History, Bug, Users, Settings } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export const CustomSidebar = () => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useUser();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Test Cases", path: "/test-cases", icon: ClipboardList },
    { name: "Executions", path: "/test-executions", icon: History },
    { name: "Defects", path: "/defects", icon: Bug },
    { name: "Projects", path: "/projects", icon: Users },
    { name: "Parameters", path: "/parameters", icon: Settings },
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
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              asChild
              className="w-full justify-start gap-3"
            >
              <Link to={item.path}>
                <item.icon size={16} />
                <span>{item.name}</span>
                {location.pathname === item.path && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            </Button>
          ))}
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
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
