import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string) => void;
  singleSelect?: boolean;
}

export function UserCard({
  user,
  isSelected,
  onSelect,
  singleSelect = false,
}: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format the last active time
  const lastActive = formatDistanceToNow(new Date(user.lastActive), {
    addSuffix: true,
  });

  // Get initials from username for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 sm:p-3 rounded-md transition-all duration-200 cursor-pointer chat-item",
        isSelected ? "bg-accent/40" : "hover:bg-accent/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(user._id)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-border flex-shrink-0 hidden sm:flex">
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col overflow-hidden min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium truncate text-sm sm:text-base cursor-p">
                  {user.username}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="break-words">Username: {user.username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground truncate cursor-pointer">
                  {user.email} | {lastActive}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="break-words">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Last Active:</strong> {lastActive}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {!singleSelect && (
        <Checkbox
          checked={isSelected}
          className={cn(
            "transition-opacity duration-200",
            isSelected ? "opacity-100" : isHovered ? "opacity-70" : "opacity-0"
          )}
          onCheckedChange={() => onSelect(user._id)}
        />
      )}
    </div>
  );
}
