"use client";

import { FeatureComponent } from "./types";
import { UIRenderer } from "./UIRenderer";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FeatureRendererProps {
  component: FeatureComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function FeatureRenderer({
  component,
  onAction,
  formValues,
  onFormChange
}: FeatureRendererProps) {
  const { title, description, features = [], icon, variant = "default" } = component;

  if (!title && !description && features.length === 0) return null;

  const variantStyles = {
    default: "bg-white border-gray-100",
    primary: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    dark: "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700",
  };

  const textColor = variant === "dark" ? "text-white" : "text-gray-900";
  const descColor = variant === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div className={cn(
      "rounded-2xl border p-8 transition-all hover:shadow-lg",
      variantStyles[variant]
    )}>
      {icon && (
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4",
          variant === "dark" ? "bg-white/10" : "bg-gray-100"
        )}>
          <span className="text-2xl">{icon}</span>
        </div>
      )}

      {title && (
        <h3 className={cn("text-2xl font-bold mb-3", textColor)}>
          {title}
        </h3>
      )}

      {description && (
        <p className={cn("text-base mb-6", descColor)}>
          {description}
        </p>
      )}

      {features.length > 0 && (
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                variant === "dark" ? "text-green-400" : "text-green-600"
              )} />
              <div className="flex-1">
                {typeof feature === "string" ? (
                  <span className={descColor}>{feature}</span>
                ) : (
                  <UIRenderer
                    component={feature}
                    onAction={onAction}
                    formValues={formValues}
                    onFormChange={onFormChange}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}