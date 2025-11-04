"use client";

import { AlertComponent } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertRendererProps {
  component: AlertComponent;
}

export function AlertRenderer({ component }: AlertRendererProps) {
  const { title, description, variant = "default" } = component;

  if (!title && !description) return null;

  const variantConfig = {
    default: {
      icon: Info,
      className: "border-gray-200 bg-gray-50 text-gray-900",
      iconClassName: "text-gray-600",
    },
    success: {
      icon: CheckCircle,
      className: "border-green-200 bg-green-50 text-green-900",
      iconClassName: "text-green-600",
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-200 bg-yellow-50 text-yellow-900",
      iconClassName: "text-yellow-600",
    },
    error: {
      icon: AlertCircle,
      className: "border-red-200 bg-red-50 text-red-900",
      iconClassName: "text-red-600",
    },
    info: {
      icon: Info,
      className: "border-blue-200 bg-blue-50 text-blue-900",
      iconClassName: "text-blue-600",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Alert className={cn("border", config.className)}>
      <Icon className={cn("h-4 w-4", config.iconClassName)} />
      {title && <AlertTitle className="font-medium">{title}</AlertTitle>}
      {description && (
        <AlertDescription className="text-sm">{description}</AlertDescription>
      )}
    </Alert>
  );
}
