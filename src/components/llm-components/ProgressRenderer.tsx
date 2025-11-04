"use client";

import { ProgressComponent } from "./types";
import { Progress } from "@/components/ui/progress";

interface ProgressRendererProps {
  component: ProgressComponent;
}

export function ProgressRenderer({ component }: ProgressRendererProps) {
  const { value = 0, max = 100, showLabel = true, label } = component;

  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{label || "Progress"}</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
