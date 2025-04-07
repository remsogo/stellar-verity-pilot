
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  BarChart,
  CheckCircle2,
  ClipboardList,
  Files,
  FolderTree,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Test Cases", icon: ClipboardList, path: "/test-cases" },
  { name: "Test Execution", icon: CheckCircle2, path: "/executions" },
  { name: "Test Suites", icon: FolderTree, path: "/suites" },
  { name: "Reports", icon: BarChart, path: "/reports" },
  { name: "Test Files", icon: Files, path: "/files" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("full_name, email")
          .eq("auth_id", authUser.id)
          .single();
          
        if (profileData) {
          setUser({
            fullName: profileData.full_name,
            email: profileData.email
          });
        } else {
          setUser({
            fullName: authUser.user_metadata?.full_name || "User",
            email: authUser.email || ""
          });
        }
      }
    };
    
    getUserProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <SidebarProvider>
      <ShadcnSidebar collapsible={collapsed ? "icon" : "none"}>
        <SidebarHeader>
          <div className="flex items-center p-2">
            {!collapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                TestNexus
              </h1>
            )}
            {collapsed && <Home className="w-6 h-6 mx-auto text-primary" />}
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.path}
                      tooltip={item.name}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User2 className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{user?.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="w-8 h-8"
              >
                {collapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 6 6 6-6 6"></path><path d="M21 12H9"></path><path d="M3 12h.01"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6 3 12l6 6"></path><path d="M3 12h18"></path>
                  </svg>
                )}
              </Button>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </ShadcnSidebar>
    </SidebarProvider>
  );
};
