
import { cn } from "@/lib/utils";
import {
  BarChart,
  CheckCircle2,
  ClipboardList,
  Files,
  FolderTree,
  Home,
  LayoutDashboard,
  Settings,
  User2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 h-14 border-b border-border">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            TestNexus
          </h1>
        )}
        {collapsed && <Home className="w-6 h-6 mx-auto text-primary" />}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User2 className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mx-auto">
              <User2 className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between">
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
          {!collapsed && (
            <>
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Settings size={18} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
