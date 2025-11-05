"use client";

import { AccordionComponent } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UIRenderer } from "./UIRenderer";

interface AccordionRendererProps {
  component: AccordionComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function AccordionRenderer({ component, onAction, formValues, onFormChange }: AccordionRendererProps) {
  const { items = [], allowMultiple = false } = component;

  if (items.length === 0) return null;

  const accordionProps = allowMultiple
    ? { type: "multiple" as const }
    : { type: "single" as const, collapsible: true };

  return (
    <Accordion
      {...accordionProps}
      className="w-full space-y-2"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border border-gray-200 rounded-lg px-4"
        >
          <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
            {item.title || `Item ${index + 1}`}
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {item.content?.map((child, childIndex) => (
              <UIRenderer
                key={childIndex}
                component={child}
                onAction={onAction}
                formValues={formValues}
                onFormChange={onFormChange}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
