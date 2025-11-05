"use client";

import { ComparisonComponent } from "./types";
import { UIRenderer } from "./UIRenderer";
import { cn } from "@/lib/utils";

interface ComparisonRendererProps {
  component: ComparisonComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function ComparisonRenderer({
  component,
  onAction,
  formValues,
  onFormChange
}: ComparisonRendererProps) {
  const { items = [], title } = component;

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      {title && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-100">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "p-4 sm:p-6",
              index % 2 === 0 ? "md:border-r border-gray-100" : "",
              index > 0 && "border-t md:border-t-0 border-gray-100"
            )}
          >
            {item.label && (
              <div className="mb-4">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                  {item.label}
                </h4>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>
            )}

            {item.children && item.children.length > 0 && (
              <div className="space-y-3">
                {item.children.map((child, childIndex) => (
                  <UIRenderer
                    key={childIndex}
                    component={child}
                    onAction={onAction}
                    formValues={formValues}
                    onFormChange={onFormChange}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}