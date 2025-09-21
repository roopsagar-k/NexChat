import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, PaperclipIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string, images?: File[]) => void;
  onTyping: () => void;
}

export function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || images.length > 0) {
      onSendMessage(message, images);
      setMessage("");
      setImages([]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-background p-3 sm:p-4">
      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 rounded-md overflow-hidden border"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 shrink-0 flex"
          type="button"
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
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
            className="min-h-[48px] max-h-[120px] resize-none border-0 p-3 pr-12 focus-visible:ring-0 text-base sm:text-sm"
            rows={1}
          />
          <Button
            size="icon"
            className={cn(
              "absolute bottom-1 right-1 h-8 w-8 rounded-full",
              !message.trim() &&
                images.length === 0 &&
                "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSend}
            disabled={!message.trim() && images.length === 0}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-right px-2 hidden sm:block">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
