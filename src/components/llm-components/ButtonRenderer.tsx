"use client";

import { cn } from "@/lib/utils";
import { ButtonComponent } from "./types";

interface ButtonRendererProps {
  component: ButtonComponent;
  onAction?: (action: string, label: string) => void;
}

export function ButtonRenderer({ component, onAction }: ButtonRendererProps) {
  const { label, action, variant = "primary", size = "md" } = component;

  if (!label || !action) return null;

  const variantClasses = {
    primary: "bg-gradient-to-br from-pink-500 to-yellow-500 text-white hover:opacity-90 shadow-sm",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const handleClick = () => {
    onAction?.(action, label);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-lg font-medium transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {label}
    </button>
  );
}
