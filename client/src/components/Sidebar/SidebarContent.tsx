"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/context/ChatsContext";
import type { PanelStatus } from "@/lib/types/types";
import { UserCard } from "../UserCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquarePlusIcon, UsersIcon } from "lucide-react";
import { requestHandler } from "@/lib/requestHandler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import ChatLists from "./ChatLists";
import GroupLists from "./GroupLists";

interface SidebarContentProps {
  active: PanelStatus;
}

const SidebarContent = ({ active }: SidebarContentProps) => {
  const { searchResults, setChats, setGroupChats } = useChat();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatType, setChatType] = useState<"one-to-one" | "group" | null>(null);
  const [chatName, setChatName] = useState("");

  async function getChats() {
    const { data } = await requestHandler({
      method: "GET",
      endpoint: "/api/chats/one-to-one",
    });
    setChats(data);
  }

  async function getGroupChats() {
    const { data } = await requestHandler({
      method: "GET",
      endpoint: "/api/chats/group",
    });
    setGroupChats(data);
  }

  useEffect(() => {
    async function getData() {
      await Promise.all([getChats(), getGroupChats()]);
    }
    getData();
  }, []);

  // Get selected user names for display
  const selectedUserNames = searchResults
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.username || user.email);

  // Reset dialog state when closed
  useEffect(() => {
    if (!dialogOpen) {
      setChatName("");
      setChatType(null);
    }
  }, [dialogOpen]);

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
  const handleCreateChat = (type: "one-to-one" | "group") => {
    setChatType(type);

    // For one-to-one chats, pre-fill with user name
    if (type === "one-to-one" && selectedUsers.length === 1) {
      const selectedUser = searchResults.find(
        (user) => user._id === selectedUsers[0]
      );
      if (selectedUser) {
        setChatName(selectedUser.username || selectedUser.email || "");
      }
    }

    setDialogOpen(true);
  };

  // Submit chat creation
  const handleSubmitChat = async () => {
    try {
      if (chatType === "one-to-one") {
        console.log("one-to-one chat type");
        const { success, message } = await requestHandler({
          endpoint: "/api/chats/one-to-one",
          method: "POST",
          data: {
            name: chatName,
            recipientid: selectedUsers[0],
          },
        });
        if (success) toast(message);
      } else if (chatType === "group") {
        console.log("group chat");
        const { success, message } = await requestHandler({
          endpoint: "/api/chats/group",
          method: "POST",
          data: {
            name: chatName,
            members: selectedUsers,
          },
        });
        if (success) toast(message);
      }

      // Reset state after successful creation
      setSelectedUsers([]);
      setDialogOpen(false);
      setChatName("");
      // Optionally refresh chats list
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const canCreateOneToOne = selectedUsers.length === 1;
  const canCreateGroup = selectedUsers.length >= 2;

  // Render user search results panel
  if (active === "user-search") {
  return (
    <div className="flex flex-col h-full sidebar-content">
        {/* Header with selection count and action buttons */}
        <div
          className={cn(
            "py-3 px-3 sm:px-4 flex justify-between items-center border-b border-border mb-2 transition-all duration-300",
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
        <div className="flex-1 overflow-y-auto p-2 space-y-1 min-w-0 max-w-auto">
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
                Search for users by username or email
              </p>
            </div>
          )}
        </div>

        {/* Chat creation dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {chatType === "one-to-one"
                  ? "Start a Conversation"
                  : "Create Group Chat"}
              </DialogTitle>
              <DialogDescription>
                {chatType === "one-to-one"
                  ? "You're about to create a one-to-one chat. Confirm the name and click 'Create Chat' to begin messaging."
                  : `You're creating a group chat with ${selectedUsers.length} participants. Give your group a name.`}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-4 items-center gap-4 py-4">
              <Label htmlFor="chatName" className="text-right">
                {chatType === "one-to-one" ? "Name" : "Group Name"}
              </Label>
              <div className="col-span-3">
                <Input
                  id="chatName"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder={chatType === "group" ? "Enter group name" : ""}
                  className="w-full"
                  readOnly={chatType === "one-to-one"}
                />
              </div>

              {chatType === "group" && (
                <>
                  <Label className="text-right col-span-1">Participants</Label>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    {selectedUserNames.join(", ")}
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSubmitChat}
                disabled={!chatName.trim()}
              >
                Create Chat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (active === "chats") {
    return <ChatLists />;
  }

  if (active === "group-chats") {
    return <GroupLists />;
  }
  // Return empty div for other panel types
  return <div></div>;
};

export default SidebarContent;
