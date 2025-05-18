import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Message, MessageWithSender } from "@/lib/types/types";
import { useAuth } from "@/hooks/AuthProvider";

interface MessageProps {
  message: MessageWithSender;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

export function Message({
  message,
  isFirstInGroup,
  isLastInGroup,
}: MessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user._id) {
      console.log("No authenticated user found or user has no ID");
      setIsSent(false);
      return;
    }

    if (!message?.sender?._id) {
      console.log("Message has no sender ID");
      setIsSent(false);
      return;
    }

    const isSentByCurrentUser = message.sender._id === user._id;
    setIsSent(isSentByCurrentUser);
  }, [user, message]); // Added message to dependencies

  // Format the message timestamp
  const formattedTime = message.createdAt
    ? formatDistance(new Date(message.createdAt), new Date(), {
        addSuffix: true,
      })
    : "";

  return (
    <div
      className={cn(
        "flex gap-2 group relative",
        isSent ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar for received messages */}
      {!isSent && (
        <div className="flex-shrink-0 w-10">
          {isFirstInGroup && (
            <Avatar className="h-8 w-8 border border-border absolute bottom-0 left-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                {message.sender?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className={cn("max-w-[75%] flex flex-col", !isSent ? "ml-1" : "")}>
        {/* Sender name for first message in group */}
        {isFirstInGroup && !isSent && (
          <div className="text-xs font-medium text-muted-foreground mb-1 ml-1">
            {message.sender?.username || "Unknown"}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 break-words",
            isSent
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-accent text-accent-foreground rounded-bl-sm",
            isLastInGroup ? "" : isSent ? "rounded-br-2xl" : "rounded-bl-2xl"
          )}
        >
          {message.content}
        </div>

        {/* Time */}
        <div
          className={cn(
            "flex items-center text-xs text-muted-foreground mt-1",
            isSent ? "justify-end" : "justify-start",
            isHovered || isLastInGroup
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-1">{formattedTime}</span>
              </TooltipTrigger>
              <TooltipContent>
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleString()
                  : "Unknown time"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
