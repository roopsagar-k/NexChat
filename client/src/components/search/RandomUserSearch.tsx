import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { requestHandler } from "@/lib/requestHandler";
import { useChat } from "@/context/ChatsContext";

const RandomUserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSearchResults } = useChat();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    console.log("Searching for:", searchQuery);
    try {
      const { data: users } = await requestHandler({
        method: "GET",
        endpoint: "/api/users",
        params: {
          search: searchQuery.trim(),
        },
      });
      console.log(users);
      setSearchResults(users || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="flex gap-2 w-full min-w-0">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search users..."
          className="pl-9 pr-9 bg-secondary/50 border-secondary focus-visible:ring-primary/20 w-full min-w-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 hover:bg-transparent"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        size="sm"
        className="shrink-0"
        disabled={!searchQuery.trim()}
      >
        Search
      </Button>
    </div>
  );
};

export default RandomUserSearch;
