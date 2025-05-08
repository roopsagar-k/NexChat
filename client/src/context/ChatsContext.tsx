import React, { createContext, useContext, useState } from "react";
import { User } from "@/lib/types/types";

interface IChatContext {
  chats: User[];
  groupChats: User[];
  searchResults: User[];
  setChats: React.Dispatch<React.SetStateAction<User[]>>;
  setGroupChats: React.Dispatch<React.SetStateAction<User[]>>;
  setSearchResults: React.Dispatch<React.SetStateAction<User[]>>;
}

const ChatContext = createContext<IChatContext | null>(null);

export function ChatContextProvder({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chats, setChats] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  return (
    <ChatContext.Provider
      value={{
        chats,
        groupChats,
        searchResults,
        setChats,
        setGroupChats,
        setSearchResults,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if(!context) throw Error("useChat must be used within the ChatContextProvider");
    return context;
}
