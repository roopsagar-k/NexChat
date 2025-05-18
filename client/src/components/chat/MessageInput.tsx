import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, PaperclipIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: () => void;
}

export function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping();
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex items-end gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 shrink-0"
          type="button"
          aria-label="Attach file"
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>

        <div
          className={cn(
            "relative flex-1 overflow-hidden rounded-md border bg-background",
            "focus-within:ring-1 focus-within:ring-ring"
          )}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none border-0 p-3 pr-12 focus-visible:ring-0"
            rows={1}
          />
          <Button
            size="icon"
            className={cn(
              "absolute bottom-1 right-1 h-8 w-8 rounded-full",
              !message.trim() && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-right px-2">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
