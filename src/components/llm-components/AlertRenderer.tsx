"use client";

import { AlertComponent } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface AlertRendererProps {
  component: AlertComponent;
}

export function AlertRenderer({ component }: AlertRendererProps) {
  const { title, description, variant = "default" } = component;

  if (!title && !description) return null;

  const variantConfig = {
    default: {
      icon: Info,
    },
    success: {
      icon: CheckCircle,
    },
    warning: {
      icon: AlertTriangle,
    },
    error: {
      icon: AlertCircle,
    },
    info: {
      icon: Info,
    },
  } as const;

  const config = variantConfig[variant] || variantConfig.default;
  const Icon = config.icon;

  return (
    <Alert className="border border-border bg-background text-foreground">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {title && <AlertTitle className="font-medium">{title}</AlertTitle>}
      {description && (
        <AlertDescription className="text-sm">{description}</AlertDescription>
      )}
    </Alert>
  );
}
