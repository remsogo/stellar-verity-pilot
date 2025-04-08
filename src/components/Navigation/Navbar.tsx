
import { SearchBar } from "@/components/UI/SearchBar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Bell, Plus, PanelLeft } from "lucide-react";

export const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="flex items-center justify-between h-14 border-b border-border px-4 bg-card">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hidden md:flex"
          data-testid="sidebar-toggle-nav"
        >
          <PanelLeft size={18} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Plus size={16} />
          <span>New Test</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full" />
        </Button>
      </div>
    </div>
  );
};
