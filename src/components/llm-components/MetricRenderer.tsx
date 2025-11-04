"use client";

import { MetricComponent } from "./types";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricRendererProps {
  component: MetricComponent;
}

export function MetricRenderer({ component }: MetricRendererProps) {
  const {
    label,
    value,
    change,
    trend,
    prefix,
    suffix,
    description,
    variant = "default"
  } = component;

  if (!value) return null;

  const variantStyles = {
    default: "bg-white border-gray-100",
    primary: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };

  const trendColor = trend === "up" ? "text-green-600" :
                    trend === "down" ? "text-red-600" :
                    "text-gray-500";

  return (
    <div className={cn(
      "rounded-xl border p-6 transition-all hover:shadow-md",
      variantStyles[variant]
    )}>
      {label && (
        <p className="text-sm font-medium text-gray-600 mb-2">
          {label}
        </p>
      )}

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {prefix}{value}{suffix}
        </span>

        {(change || trend) && (
          <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
            {trend === "up" && <TrendingUp className="h-4 w-4" />}
            {trend === "down" && <TrendingDown className="h-4 w-4" />}
            {change && <span>{change}</span>}
          </div>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-500 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}