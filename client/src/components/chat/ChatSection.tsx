import { useChat } from "@/context/ChatsContext";
import { useEffect, useRef, useState } from "react";
import { requestHandler } from "@/lib/requestHandler";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/Socket";
import { MessageWithSender } from "@/lib/types/types";
import { uploadImage } from "@/lib/api";
import { useAuth } from "@/hooks/AuthProvider";

const ChatSection = () => {
  const { activeChatId } = useChat();
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  async function getMessages(chatId: string | null) {
    if (chatId === null) return;

    setIsLoading(true);
    setError("");

    try {
      const { success, data, message } = await requestHandler({
        method: "GET",
        endpoint: `/api/messages/${chatId}`,
      });

      if (success) {
        console.log("messages", data);
        setMessages(data);
      } else {
        setError(message || "Failed to load messages");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(content: string, images?: File[]) {
    if (!activeChatId || (!content.trim() && images?.length === 0)) return;

    const tempId = `temp-${Date.now()}`;
    const localUrls = images?.map((file) => URL.createObjectURL(file)) || [];

    const tempMessage: MessageWithSender = {
      _id: tempId,
      chatId: activeChatId,
      content: content.trim(),
      attachments: localUrls, // show instantly
      sender: user!, // current logged-in user
      createdAt: new Date(),
      updatedAt: new Date(),
      pending: true, // custom flag
    };

    // Show instantly
    setMessages((prev) => [...prev, tempMessage]);

    let keys = null;
    if (images && images.length > 0) {
      keys = await Promise.all(images.map((image) => uploadImage(image)));
    }

    socket?.emit("new-message", {
      chatId: activeChatId,
      content: content.trim(),
      keys: keys || [],
      tempId,
    });
    console.log("new message event triggered");
  }

  const handleTyping = () => {
    if (!activeChatId) return;

    socket?.emit("typing", { chatId: activeChatId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop-typing", { chatId: activeChatId });
    }, 1000);
  };

  useEffect(() => {
    if (activeChatId) {
      getMessages(activeChatId);
      socket?.emit("join-chat", { chatId: activeChatId });
    }

    return () => {
      if (activeChatId) {
        socket?.emit("leave-chat", { chatId: activeChatId });
      }
    };
  }, [activeChatId]);

  useEffect(() => {
    socket?.on("message-sent", ({ message, tempId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...message, pending: false } : m))
      );
    });

    socket?.on("new-message-received", ({ message }) => {
      setMessages((prev) => [...prev, message]);
      socket.emit("message-received", {
        messageId: message._id,
        chatId: message.chatId,
      });
    });

    socket?.on("message-deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket?.on("user-typing", ({ userId, chatId }) => {
      if (chatId === activeChatId) {
        setIsTyping(true);
      }
    });

    socket?.on("user-stopped-typing", ({ userId, chatId }) => {
      if (chatId === activeChatId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("new-message-received");
      socket?.off("message-sent");
      socket?.off("message-deleted");
      socket?.off("user-typing");
      socket?.off("user-stopped-typing");
    };
  }, [activeChatId]);

  if (!activeChatId) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className={cn("flex-1 overflow-hidden", isLoading && "opacity-60")}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={error}
          isTyping={isTyping}
        />
      </div>
      <div className="flex-shrink-0">
        <MessageInput onSendMessage={sendMessage} onTyping={handleTyping} />
      </div>
    </div>
  );
};

export default ChatSection;
