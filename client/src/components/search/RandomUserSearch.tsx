import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { requestHandler } from "@/lib/requestHandler";
import { useChat } from "@/context/ChatsContext";

const RandomUserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSearchResults } = useChat();

  const handleSearch = async () => {
    console.log("Searching for:", searchQuery);
    const { data: users } = await requestHandler({
      method: "GET",
      endpoint: "/api/users",
      params: {
        search: searchQuery.trim(),
      },
    });
    console.log(users);
    setSearchResults(users);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search users with email or username..."
          className="pl-9 bg-secondary/50 border-secondary focus-visible:ring-primary/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="bg-primary hover:bg-primary/90 hover:cursor-pointer"
      >
        Search
      </Button>
    </div>
  );
};

export default RandomUserSearch;
