import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import Panel from "@/components/Sidebar/Panel";
import { useState } from "react";
import { PanelStatus } from "@/lib/types/types";
import SidebarContent from "@/components/Sidebar/SidebarContent";
import { ChatContextProvder } from "@/context/ChatsContext";
import ChatSection from "@/components/chat/ChatSection";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const HomePage = () => {
  const [panelStatus, setPanelStatus] = useState<PanelStatus>("chats");

  return (
    <ChatContextProvder>
      <div className="bg-background flex w-full h-screen">
        {/* Mobile sidebar using Sheet component */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-4 left-4 z-40 h-10 w-10"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-auto p-0">
            <div className="flex h-full">
              <div className="bg-secondary h-full w-16 flex-shrink-0">
                <Panel active={panelStatus} setActive={setPanelStatus} />
              </div>
              <div className="flex flex-col w-full">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <SidebarHeader active={panelStatus} />
                <SidebarContent active={panelStatus} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-auto border-r border-border">
          <div className="bg-secondary h-screen w-16 flex-shrink-0">
            <Panel active={panelStatus} setActive={setPanelStatus} />
          </div>
          <div className="flex flex-col w-full">
            <SidebarHeader active={panelStatus} />
            <SidebarContent active={panelStatus} />
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-center p-4 border-b border-border bg-background">
            <h1 className="text-lg font-semibold">NexChat</h1>
          </div>
          
          <ChatSection />
        </div>
      </div>
    </ChatContextProvder>
  );
};

export default HomePage;
