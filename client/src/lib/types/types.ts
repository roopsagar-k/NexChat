export type PanelStatus = "chats" | "group-chats" | "user-search";

export type User = {
  _id: string;
  email: string;
  username: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Chat = {
  _id: string;
  isGroup: boolean;
  name: string;
  members: User[];
  groupAdmin?: User; 
  createdAt: Date;
  updatedAt: Date;
};


export type Message = {
  _id: string;
  chatId: string;
  sender: string;
  content: string;
  attachments: [];
  createdAt: Date;
  updatedAt: Date;
};

export type MessageWithSender = {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  pending?: boolean
};
