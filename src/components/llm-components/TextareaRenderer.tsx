"use client";

import { TextareaComponent } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextareaRendererProps {
  component: TextareaComponent;
  value?: string;
  onChange?: (id: string, value: string) => void;
  isInFlexRow?: boolean;
}

export function TextareaRenderer({ component, value = "", onChange, isInFlexRow = false }: TextareaRendererProps) {
  const { id, label, placeholder, rows = 4, required = false } = component;

  if (!id) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(id, e.target.value);
  };

  return (
    <div className={cn(
      "space-y-2",
      isInFlexRow && "flex-1 min-w-0"
    )}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={id}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
        onChange={handleChange}
        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 resize-none"
      />
    </div>
  );
}
