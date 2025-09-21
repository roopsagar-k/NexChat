import { useChat } from "@/context/ChatsContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { getInitials, cn } from "@/lib/utils";
import { useAuth } from "@/hooks/AuthProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatLists = () => {
  const { chats, setActiveChatId, activeChatId, chatSearchQuery } = useChat();
  const { user } = useAuth();

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    if (!chatSearchQuery.trim()) return true;
    
    const otherUser = chat.members.find(
      (member) => member._id !== user?._id
    );
    
    if (!otherUser) return false;
    
    const searchLower = chatSearchQuery.toLowerCase();
    return (
      otherUser.username.toLowerCase().includes(searchLower) ||
      otherUser.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1 min-w-0">
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => {
          console.log(chats)
          const otherUser = chat.members.find(
            (member) => member._id !== user?._id
          );
          console.log("other user", otherUser)
        

          return (
            <div
              onClick={() => setActiveChatId(chat._id)}
              key={chat._id}
              className={cn(
                "flex items-center gap-3 p-2 sm:p-3 rounded-md transition-all duration-200 cursor-pointer hover:bg-accent chat-item",
                activeChatId === chat._id && "bg-accent"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 border border-border flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {otherUser ? getInitials(otherUser.username) : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium truncate text-sm sm:text-base cursor-pointer">
                          {otherUser
                            ?  otherUser.username 
                            : "Unknown User"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="break-words">
                          {otherUser
                            ? `${otherUser.username} (${otherUser.email})`
                            : "Unknown User"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground truncate cursor-pointer">
                          {format(new Date(chat.updatedAt), "PPpp")}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Last updated: {format(new Date(chat.updatedAt), "PPpp")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
          <div className="bg-muted rounded-full p-3 mb-2">
            <UsersIcon className="h-6 w-6 opacity-50" />
          </div>
          <p>{chatSearchQuery.trim() ? "No chats found" : "No chats yet"}</p>
          <p className="text-sm mt-1">
            {chatSearchQuery.trim() 
              ? "Try searching with a different term" 
              : "Start a conversation to see chats here"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatLists;
