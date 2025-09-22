import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MessageWithSender } from "@/lib/types/types";
import { useAuth } from "@/hooks/AuthProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";


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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id || !message?.sender?._id) {
      setIsSent(false);
      return;
    }
    setIsSent(message.sender._id === user._id);
  }, [user, message]);

  // Format time function
  const formatTimeDistance = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const formattedTime = message.createdAt
    ? formatTimeDistance(new Date(message.createdAt))
    : "";

  const getImageGridClass = (imageCount: number, index: number) => {
    if (imageCount === 1) return "col-span-2 row-span-2";
    if (imageCount === 2) return "col-span-1 row-span-2";
    if (imageCount === 3) {
      return index === 0 ? "col-span-1 row-span-2" : "col-span-1 row-span-1";
    }
    if (imageCount === 4) return "col-span-1 row-span-1";
    // For more than 4 images, show first 3 and a "+X more" overlay
    if (index < 3) {
      if (index === 0 && imageCount > 4) return "col-span-1 row-span-2";
      return "col-span-1 row-span-1";
    }
    return "hidden";
  };

  return (
    <div
      className={cn(
        "flex gap-3 group relative transition-all duration-200 ease-in-out",
        isSent ? "justify-end" : "justify-start",
        isHovered && "transform translate-y-[-1px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar for received messages */}
      {!isSent && (
        <div className="flex-shrink-0 w-10 relative">
          {isFirstInGroup && (
            <Avatar className="h-8 w-8 border-2 border-border/50 shadow-sm absolute bottom-0 left-0 transition-all duration-200 hover:shadow-md hover:border-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-sm">
                {message.sender?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] flex flex-col",
          !isSent ? "ml-1" : ""
        )}
      >
        {/* Sender name for first message in group */}
        {isFirstInGroup && !isSent && (
          <div className="text-xs font-semibold text-muted-foreground/80 mb-2 ml-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate cursor-pointer hover:text-primary transition-colors duration-200">
                    {message.sender?.username || "Unknown"}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs bg-popover border border-border shadow-lg"
                >
                  <p className="break-words text-sm">
                    {message.sender?.username || "Unknown"}
                    {message.sender?.email && (
                      <span className="block text-xs text-muted-foreground">
                        {message.sender.email}
                      </span>
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 break-words text-sm sm:text-base shadow-sm transition-all duration-200 ease-in-out backdrop-blur-sm",
            isSent
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md shadow-primary/20"
              : "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-bl-md border border-border/50",
            isLastInGroup ? "" : isSent ? "rounded-br-2xl" : "rounded-bl-2xl",
            message.pending && "opacity-70 blur-[0.5px] animate-pulse",
            isHovered && "shadow-md transform translate-y-[-1px]",
            isSent && isHovered && "shadow-primary/30",
            !isSent && isHovered && "shadow-secondary/30"
          )}
        >
          <div
            className={cn(
              message.pending && "relative",
              message.pending &&
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-background/30 before:to-transparent before:animate-pulse"
            )}
          >
            {message.content}
          </div>
        </div>

        {/* Attachments (images) with grid layout */}

        {message.attachments && message.attachments.length > 0 && (
          <>
            <div
              className={cn(
                "mt-2 rounded-xl overflow-hidden",
                message.attachments.length === 1 ? "max-w-sm" : "max-w-md"
              )}
            >
              <div
                className={cn(
                  "grid gap-1",
                  message.attachments.length === 1 &&
                    "grid-cols-2 grid-rows-2 h-64",
                  message.attachments.length === 2 &&
                    "grid-cols-2 grid-rows-2 h-64",
                  message.attachments.length === 3 &&
                    "grid-cols-2 grid-rows-2 h-64",
                  message.attachments.length >= 4 &&
                    "grid-cols-2 grid-rows-2 h-64"
                )}
              >
                {message.attachments.slice(0, 4).map((url, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative group/image overflow-hidden rounded-lg cursor-pointer transition-all duration-300",
                      getImageGridClass(message.attachments!.length, idx),
                      "hover:brightness-110 hover:shadow-lg"
                    )}
                    onClick={() => setSelectedImage(url)} // set selected image
                  >
                    <img
                      src={url}
                      alt={`Attachment ${idx + 1}`}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-300",
                        message.pending && "opacity-60 blur-sm grayscale-[30%]",
                        "group-hover/image:scale-105"
                      )}
                    />
                    {idx === 3 && message.attachments!.length > 4 && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-lg font-semibold text-foreground">
                          +{message.attachments!.length - 4} more
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Dialog for viewing image */}
            <Dialog
              open={!!selectedImage}
              onOpenChange={() => setSelectedImage(null)}
            >
              <DialogContent className="!w-[90vw] !max-w-[90vw] h-[90vh] p-2 bg-background/90 border-none shadow-lg flex items-center justify-center rounded-lg">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Full view"
                    className="max-w-full max-h-full object-contain rounded-md"
                  />
                )}
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Time with enhanced styling */}
        <div
          className={cn(
            "flex items-center text-xs text-muted-foreground/70 mt-2 transition-all duration-200",
            isSent ? "justify-end" : "justify-start",
            isHovered || isLastInGroup
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-2 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border/30 hover:bg-background/70 hover:border-border/50 transition-all duration-200 cursor-default">
                  {formattedTime}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border shadow-lg">
                <p className="font-medium">
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleString()
                    : "Unknown time"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
