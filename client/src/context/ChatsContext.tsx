import React, { createContext, useContext, useState } from "react";
import { Chat, User } from "@/lib/types/types";

interface IChatContext {
  chats: Chat[];
  groupChats: Chat[];
  searchResults: User[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setGroupChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setSearchResults: React.Dispatch<React.SetStateAction<User[]>>;
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatContext = createContext<IChatContext | null>(null);

export function ChatContextProvder({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [groupChats, setGroupChats] = useState<Chat[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  return (
    <ChatContext.Provider
      value={{
        chats,
        groupChats,
        searchResults,
        setChats,
        setGroupChats,
        setSearchResults,
        activeChatId,
        setActiveChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw Error("useChat must be used within the ChatContextProvider");
  return context;
};
