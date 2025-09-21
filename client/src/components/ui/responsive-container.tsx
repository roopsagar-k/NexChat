import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "sidebar" | "chat" | "auth";
}

export function ResponsiveContainer({ 
  children, 
  className, 
  variant = "default" 
}: ResponsiveContainerProps) {
  const baseClasses = "w-full h-full";
  
  const variantClasses = {
    default: "flex flex-col",
    sidebar: "flex flex-col lg:flex-row",
    chat: "flex flex-col min-h-0",
    auth: "flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12"
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}
