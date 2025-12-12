// components/shared/ui/Badge.tsx
import { cn } from "../../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-blue-100 text-blue-800": variant === "default",
          "bg-gray-100 text-gray-800": variant === "secondary",
          "border border-gray-300 bg-transparent text-gray-700":
            variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
