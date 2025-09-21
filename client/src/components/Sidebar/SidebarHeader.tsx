import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/AuthProvider";
import { PanelStatus } from "@/lib/types/types";
import UserChatSearch from "../search/UserChatSearch";
import UserGroupSearch from "../search/UserGroupSearch";
import RandomUserSearch from "../search/RandomUserSearch";
import { LogOut, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SidebarHeader = ({ active }: { active: PanelStatus }) => {
  const { user, loading, logout } = useAuth();

  return (
    <div className="border-b border-border w-full">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3">
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="space-y-1 min-w-0 flex-1">
            {loading ? (
              <>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-medium leading-none truncate cursor-pointer">
                        {user?.username}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="break-words">Username: {user?.username}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground leading-none mt-1 truncate cursor-pointer">
                        {user?.email}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="break-words">Email: {user?.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary transition-colors text-muted-foreground"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="px-3 sm:px-4 pb-3 pt-1">
        {active === "chats" && <UserChatSearch />}
        {active === "group-chats" && <UserGroupSearch />}
        {active === "user-search" && <RandomUserSearch />}
      </div>
    </div>
  );
};

export default SidebarHeader;
