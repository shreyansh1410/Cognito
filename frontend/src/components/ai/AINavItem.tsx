import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface AINavItemProps {
  className?: string;
  compact?: boolean;
}

export function AINavItem({ className, compact = false }: AINavItemProps) {
  return (
    <Link to="/ai" className={cn("block", className)}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          compact ? "px-2" : "px-4"
        )}
      >
        <Bot className="mr-2 h-4 w-4" />
        <span>AI Assistant</span>
      </Button>
    </Link>
  );
}
