import { useEffect, useRef } from "react";
import { Message } from "./Message";
import { MessageSkeleton } from "./MessageSkeleton";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { MessageWithSender as MessageType } from "@/lib/types/types";

interface MessageGroup {
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  messages: MessageType[];
  timestamp: Date;
}

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  error: string;
  isTyping?: boolean;
}

export function MessageList({
  messages,
  isLoading,
  error,
  isTyping,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  const groupMessages = (messages: MessageType[]): MessageGroup[] => {
    if (!messages.length) return [];

    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message) => {
      const shouldStartNewGroup =
        !currentGroup ||
        currentGroup.sender._id !== message.sender._id ||
        new Date(message.createdAt).getTime() -
          new Date(currentGroup.timestamp).getTime() >
          5 * 60 * 1000;

      if (shouldStartNewGroup) {
        currentGroup = {
          sender: message.sender,
          messages: [message],
          timestamp: message.createdAt,
        };
        groups.push(currentGroup);
      } else {
        if (currentGroup) {
          currentGroup.messages.push(message);
          currentGroup.timestamp = message.createdAt;
        }
      }
    });

    return groups;
  };

  const messageGroups = groupMessages(messages);

  useEffect(() => {
    if (
      messagesEndRef.current &&
      (messages.length > prevMessagesLength.current || isTyping)
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      {isLoading && !messages.length ? (
        <div className="space-y-4">
          <MessageSkeleton isSent={false} />
          <MessageSkeleton isSent={true} />
          <MessageSkeleton isSent={false} />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center p-4 text-destructive bg-destructive/10 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : !messages.length ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No messages yet. Send a message to start the conversation.</p>
        </div>
      ) : (
        <>
          {messageGroups.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="space-y-1">
              {group.messages.map((message, messageIndex) => (
                <Message
                  key={message._id}
                  message={message}
                  isFirstInGroup={messageIndex === 0}
                  isLastInGroup={messageIndex === group.messages.length - 1}
                />
              ))}
            </div>
          ))}
          {isTyping && (
            <div
              className={cn("flex items-center space-x-1 px-3 py-2")}
            >
              <div className="text-xs text-muted-foreground mr-2">Typing</div>
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full bg-muted-foreground/60",
                      "animate-bounce",
                      i === 1 && "animation-delay-200",
                      i === 2 && "animation-delay-400"
                    )}
                    style={{
                      animationDuration: "1s",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
