
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onClose?: () => void;
}

export const SearchBar = ({ onClose }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality here
    if (onClose) {
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex-1 max-w-md"
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search test cases, executions..."
          className="pl-8 w-full bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  );
};
