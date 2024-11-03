"use client";

import * as React from "react";
import { LucideIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  isPassword?: boolean;
  hasError?: boolean; // New prop to indicate error state
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, isPassword, hasError, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const StartIcon = startIcon;
    const disabled = props.value === "" || props.value === undefined || props.disabled;

    // Determine the effective type
    const effectiveType = isPassword 
      ? (showPassword ? "text" : "password")
      : type;

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <StartIcon 
              size={18} 
              className={cn("text-muted-foreground", hasError ? "text-red-500" : "text-muted-foreground")}
            />
          </div>
        )}

        <input
          type={effectiveType}
          className={cn(
            "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-10" : "",
            isPassword ? "hide-password-toggle pr-10" : "",
            hasError ? "border border-red-500" : "border border-input",
            className
          )}
          ref={ref}
          {...props}
        />

        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
          >
            {showPassword && !disabled ? (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        )}

        {/* hides browsers password toggles */}
        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
