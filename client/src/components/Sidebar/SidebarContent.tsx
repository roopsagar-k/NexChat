import { useState, useMemo } from "react";
import { useChat } from "@/context/ChatsContext";
import { PanelStatus, User } from "@/lib/types/types";
import { UserCard } from "../UserCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquarePlusIcon, UsersIcon } from "lucide-react";

interface SidebarContentProps {
  active: PanelStatus;
}

const SidebarContent = ({ active }: SidebarContentProps) => {
  const { searchResults, setSearchResults } = useChat();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle chat creation
  const handleCreateChat = async (chat: "one-to-one" | "group") => {
    if (chat === "one-to-one") {
    } else if (chat === "group") {
    }
    setSearchResults([]);
  };

  const canCreateOneToOne = selectedUsers.length === 1;
  const canCreateGroup = selectedUsers.length >= 2;

  // Render user search results panel
  if (active === "user-search") {
    return (
      <div className="flex flex-col h-full">
        {/* Header with selection count and action buttons */}
        <div
          className={cn(
            "py-3 px-4 flex justify-between items-center border-b border-border mb-2 transition-all duration-300",
            selectedUsers.length > 0
              ? "opacity-100"
              : "opacity-0 pointer-events-none h-0 py-0 mb-0"
          )}
        >
          <div className="font-medium">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
            selected
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCreateChat("one-to-one")}
              disabled={!canCreateOneToOne}
              className={cn(
                "transition-all",
                !canCreateOneToOne && "opacity-50"
              )}
            >
              <MessageSquarePlusIcon className="h-4 w-4 mr-1" />
              <span>Chat</span>
            </Button>
            <Button
              size="sm"
              onClick={() => handleCreateChat("group")}
              disabled={!canCreateGroup}
              className={cn("transition-all", !canCreateGroup && "opacity-50")}
            >
              <UsersIcon className="h-4 w-4 mr-1" />
              <span>Group</span>
            </Button>
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isSelected={selectedUsers.includes(user._id)}
                onSelect={handleUserSelect}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
              <div className="bg-muted rounded-full p-3 mb-2">
                <UsersIcon className="h-6 w-6 opacity-50" />
              </div>
              <p>No users found</p>
              <p className="text-sm mt-1">
                Try searching with a different term
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Return empty div for other panel types
  return <div></div>;
};

export default SidebarContent;
