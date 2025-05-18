import { useChat } from "@/context/ChatsContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const GroupLists = () => {
  const { groupChats, setActiveChatId, activeChatId } = useChat();

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {groupChats.length > 0 ? (
        groupChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setActiveChatId(chat._id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md transition-all duration-200 cursor-pointer hover:bg-accent",
              activeChatId === chat._id && "bg-accent"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(chat.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{chat.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {format(chat.updatedAt, "PPpp")}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
          <div className="bg-muted rounded-full p-3 mb-2">
            <UsersIcon className="h-6 w-6 opacity-50" />
          </div>
          <p>No users found</p>
          <p className="text-sm mt-1">Try searching with a different term</p>
        </div>
      )}
    </div>
  );
};

export default GroupLists;
