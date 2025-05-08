import { MessageSquareText, UserSearch, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PanelStatus } from "@/lib/types/types";

interface IconWrapperProps {
  children: React.ReactNode;
  tooltip: string;
  isActive: boolean;
  onClick: () => void;
}

const IconWrapper = ({
  children,
  tooltip,
  isActive,
  onClick,
}: IconWrapperProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={cn(
              "p-2 rounded-md transition-all duration-200 cursor-pointer",
              isActive
                ? "text-primary bg-muted"
                : "text-muted-foreground hover:text-primary hover:bg-muted/70"
            )}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Panel = ({
  setActive,
  active,
}: {
  setActive: React.Dispatch<React.SetStateAction<PanelStatus>>;
  active: PanelStatus;
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      <IconWrapper
        tooltip="Private Messages"
        isActive={active === "chats"}
        onClick={() => setActive("chats")}
      >
        <MessageSquareText className="h-6 w-6" id="chats" />
      </IconWrapper>

      <IconWrapper
        tooltip="Group Chats"
        isActive={active === "group-chats"}
        onClick={() => setActive("group-chats")}
      >
        <Users className="h-6 w-6" id="group-chats" />
      </IconWrapper>

      <IconWrapper
        tooltip="Search Users"
        isActive={active === "user-search"}
        onClick={() => setActive("user-search")}
      >
        <UserSearch className="h-6 w-6" id="user-search" />
      </IconWrapper>
    </div>
  );
};

export default Panel;
