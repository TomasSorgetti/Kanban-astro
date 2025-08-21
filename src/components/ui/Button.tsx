// src/components/ui/Button.tsx
import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "outline" | "default";
    size?: "icon" | "default";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        variant === "outline" &&
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        size === "icon" && "h-10 w-10",
        size === "default" && "h-10 px-4 py-2",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
