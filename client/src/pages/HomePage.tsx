import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import Panel from "@/components/Sidebar/Panel";
import { useState } from "react";
import { PanelStatus } from "@/lib/types/types";
import SidebarContent from "@/components/Sidebar/SidebarContent";
import { ChatContextProvder } from "@/context/ChatsContext";

const HomePage = () => {
  const [panelStatus, setPanelStatus] = useState<PanelStatus>("chats");

  return (
    <ChatContextProvder>
      <div className="bg-background grid w-full h-screen grid-cols-10">
        <div className="col-span-3 flex border-r-2">
          <div className="bg-secondary h-screen min-w-20">
            <Panel active={panelStatus} setActive={setPanelStatus} />
          </div>
          <div className="flex flex-col w-full">
            <SidebarHeader active={panelStatus} />
            <SidebarContent active={panelStatus} />
          </div>
        </div>
        <div className="col-span-7"></div>
      </div>
    </ChatContextProvder>
  );
};

export default HomePage;
