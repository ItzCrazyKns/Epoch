"use client";

import { TimelineComponent } from "./types";
import { UIRenderer } from "./UIRenderer";
import { cn } from "@/lib/utils";

interface TimelineRendererProps {
  component: TimelineComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function TimelineRenderer({
  component,
  onAction,
  formValues,
  onFormChange
}: TimelineRendererProps) {
  const { items = [], variant = "vertical" } = component;

  if (items.length === 0) return null;

  if (variant === "horizontal") {
    return (
      <div className="relative">
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 min-w-[150px]">
              <div className="relative">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  item.active ? "bg-blue-600" : "bg-gray-300"
                )} />
                {index < items.length - 1 && (
                  <div className="absolute top-2 left-4 w-full h-[2px] bg-gray-300" />
                )}
              </div>
              <div className="mt-3 text-center">
                {item.date && (
                  <p className="text-xs text-gray-500 mb-1">{item.date}</p>
                )}
                {item.title && (
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-[2px] bg-gray-200" />

      <div className="space-y-6 sm:space-y-8">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-white",
                item.active ? "bg-blue-600" : "bg-gray-300"
              )} />
            </div>

            <div className="flex-1 pb-6 sm:pb-8">
              {item.date && (
                <p className="text-xs sm:text-sm text-gray-500 mb-1">{item.date}</p>
              )}
              {item.title && (
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
              )}
              {item.description && (
                <p className="text-sm sm:text-base text-gray-600 mb-3">{item.description}</p>
              )}
              {item.children && item.children.length > 0 && (
                <div className="space-y-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}