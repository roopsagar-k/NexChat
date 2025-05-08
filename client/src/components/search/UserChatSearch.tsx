import { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const UserChatSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (value: string) => {
      setSearchQuery(value);
      // Implement search functionality here
    };
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search users..."
        className="pl-9 bg-secondary/50 border-secondary focus-visible:ring-primary/20"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

export default UserChatSearch
