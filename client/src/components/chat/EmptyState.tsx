import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
      <p className="text-muted-foreground max-w-md">
        Choose a conversation from the sidebar or start a new one to begin
        messaging.
      </p>
    </div>
  );
}
