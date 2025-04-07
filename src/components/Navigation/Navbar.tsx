
import { SearchBar } from "@/components/UI/SearchBar";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-14 border-b border-border px-4 bg-card">
      <div className="flex-1">
        <SearchBar />
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
