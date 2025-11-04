"use client";

import { SeparatorComponent } from "./types";
import { Separator } from "@/components/ui/separator";

interface SeparatorRendererProps {
  component: SeparatorComponent;
}

export function SeparatorRenderer({ component }: SeparatorRendererProps) {
  const { orientation = "horizontal" } = component;

  return (
    <Separator
      orientation={orientation}
      className="bg-gray-200"
    />
  );
}
