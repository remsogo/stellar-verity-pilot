
import { SearchBar } from "@/components/UI/SearchBar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Bell, Plus, PanelLeft, Rocket } from "lucide-react";

export const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <div className="flex items-center justify-between h-14 border-b border-border/20 px-4 bg-card/80 backdrop-blur-sm z-10">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hidden md:flex rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          data-testid="sidebar-toggle-nav"
        >
          <PanelLeft size={18} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex items-center">
          <Rocket size={20} className="text-primary mr-2" />
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-300 bg-clip-text text-transparent">TestMaster</span>
        </div>
        <div className="flex-1 mx-4">
          <SearchBar />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="gap-1 rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
          <Plus size={16} />
          <span>New Test</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell size={18} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full pulse-animation" />
        </Button>
      </div>
    </div>
  );
};
