import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
      <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
        <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
      </div>
      <h3 className="text-lg sm:text-xl font-medium mb-2">No conversation selected</h3>
      <p className="text-muted-foreground max-w-md text-sm sm:text-base">
        Choose a conversation from the sidebar or start a new one to begin
        messaging.
      </p>
    </div>
  );
}
