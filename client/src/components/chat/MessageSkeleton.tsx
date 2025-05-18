import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageSkeletonProps {
  isSent: boolean;
}

export function MessageSkeleton({ isSent }: MessageSkeletonProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isSent ? "justify-end" : "justify-start"
      )}
    >
      {!isSent && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}

      <div className="space-y-2">
        {!isSent && <Skeleton className="h-3 w-20" />}

        <div className="space-y-1">
          <Skeleton
            className={cn(
              "h-10 w-[200px] rounded-2xl",
              isSent ? "rounded-br-sm" : "rounded-bl-sm"
            )}
          />
          {Math.random() > 0.5 && (
            <Skeleton
              className={cn(
                "h-10 w-[150px] rounded-2xl",
                isSent ? "ml-auto rounded-br-2xl" : "rounded-bl-2xl"
              )}
            />
          )}
        </div>

        <Skeleton className={cn("h-2 w-12", isSent ? "ml-auto" : "")} />
      </div>
    </div>
  );
}
