import { useChat } from "@/context/ChatsContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GroupLists = () => {
  const { groupChats, setActiveChatId, activeChatId, groupSearchQuery } = useChat();

  // Filter group chats based on search query
  const filteredGroupChats = groupChats?.filter((chat) => {
    if (!groupSearchQuery.trim()) return true;
    
    const searchLower = groupSearchQuery.toLowerCase();
    return chat.name.toLowerCase().includes(searchLower);
  }) || [];

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1 min-w-0">
      {filteredGroupChats.length > 0 ? (
        filteredGroupChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setActiveChatId(chat._id)}
            className={cn(
              "flex items-center gap-3 p-2 sm:p-3 rounded-md transition-all duration-200 cursor-pointer hover:bg-accent chat-item",
              activeChatId === chat._id && "bg-accent"
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 border border-border flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(chat.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium truncate text-sm sm:text-base cursor-pointer">
                        {chat.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="break-words">Group: {chat.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground truncate cursor-pointer">
                        {format(chat.updatedAt, "PPpp")}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Last updated: {format(chat.updatedAt, "PPpp")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
          <div className="bg-muted rounded-full p-3 mb-2">
            <UsersIcon className="h-6 w-6 opacity-50" />
          </div>
          <p>{groupSearchQuery.trim() ? "No groups found" : "No groups yet"}</p>
          <p className="text-sm mt-1">
            {groupSearchQuery.trim() 
              ? "Try searching with a different term" 
              : "Create a group to see it here"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupLists;
