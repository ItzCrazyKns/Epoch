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
    primary: "bg-gradient-to-br from-pink-500 to-yellow-500 text-white hover:shadow-xl hover:brightness-110 shadow-lg backdrop-blur-sm",
    secondary: "bg-gray-800/90 text-white hover:bg-gray-800 hover:shadow-lg shadow-md backdrop-blur-sm",
    outline: "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-white hover:shadow-lg shadow-sm backdrop-blur-sm",
    ghost: "text-gray-700 hover:bg-gray-50/50 hover:text-gray-900",
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
        "rounded-xl font-semibold transition-all duration-200 cursor-pointer relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200",
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
}
