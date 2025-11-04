"use client";

import { BadgeComponent } from "./types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeRendererProps {
  component: BadgeComponent;
}

export function BadgeRenderer({ component }: BadgeRendererProps) {
  const { text, variant = "default" } = component;

  if (!text) return null;

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Badge
      className={cn(
        "text-xs font-medium border",
        variantClasses[variant]
      )}
    >
      {text}
    </Badge>
  );
}
