"use client";

import { StatsComponent } from "./types";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsRendererProps {
  component: StatsComponent;
}

export function StatsRenderer({ component }: StatsRendererProps) {
  const { items = [] } = component;

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const trendIcon = item.trend === "up" ? (
          <TrendingUp className="h-4 w-4" />
        ) : item.trend === "down" ? (
          <TrendingDown className="h-4 w-4" />
        ) : item.trend === "neutral" ? (
          <Minus className="h-4 w-4" />
        ) : null;

        const trendColor = item.trend === "up" ? "text-green-600" :
                          item.trend === "down" ? "text-red-600" :
                          "text-gray-500";

        return (
          <div
            key={index}
            className="relative rounded-xl border border-gray-100 bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            {item.icon && (
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-xl sm:text-2xl opacity-20">
                {item.icon}
              </div>
            )}

            <div className="space-y-1">
              {item.label && (
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
              )}
              {item.value && (
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              )}
              {(item.change || item.trend) && (
                <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                  {trendIcon}
                  {item.change && <span>{item.change}</span>}
                </div>
              )}
              {item.description && (
                <p className="text-xs text-gray-500 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}