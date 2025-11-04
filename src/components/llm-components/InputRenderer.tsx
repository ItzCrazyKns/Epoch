"use client";

import { InputComponent } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputRendererProps {
  component: InputComponent;
  value?: string;
  onChange?: (id: string, value: string) => void;
  isInFlexRow?: boolean;
}

export function InputRenderer({ component, value = "", onChange, isInFlexRow = false }: InputRendererProps) {
  const { id, label, placeholder, inputType = "text", required = false } = component;

  if (!id) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <Input
        id={id}
        type={inputType}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={handleChange}
        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
      />
    </div>
  );
}
