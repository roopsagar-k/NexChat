export type PanelStatus = "chats" | "group-chats" | "user-search";

export type User = {
    _id: string;
    email: string;
    username: string;
    lastActive: Date,
    createdAt: Date,
    updatedAt: Date,
}