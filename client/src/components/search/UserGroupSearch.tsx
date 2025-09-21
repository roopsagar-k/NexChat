import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { useChat } from "@/context/ChatsContext";
import { Button } from "../ui/button";

const UserGroupSearch = () => {
  const { groupSearchQuery, setGroupSearchQuery } = useChat();

  const handleSearch = (value: string) => {
    setGroupSearchQuery(value);
  };

  const clearSearch = () => {
    setGroupSearchQuery("");
  };

  return (
    <div className="relative w-full min-w-0">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search groups..."
        className="pl-9 pr-9 bg-secondary/50 border-secondary focus-visible:ring-primary/20 w-full min-w-0"
        value={groupSearchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {groupSearchQuery && (
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
  );
};

export default UserGroupSearch;
