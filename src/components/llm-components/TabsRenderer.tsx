"use client";

import { TabsComponent } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UIRenderer } from "./UIRenderer";

interface TabsRendererProps {
  component: TabsComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function TabsRenderer({ component, onAction, formValues, onFormChange }: TabsRendererProps) {
  const { tabs = [] } = component;

  if (tabs.length === 0) return null;

  return (
    <Tabs defaultValue="tab-0" className="w-full">
      <TabsList className="bg-gray-100 border border-gray-200">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={index}
            value={`tab-${index}`}
            className="text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            {tab.label || `Tab ${index + 1}`}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={`tab-${index}`} className="mt-4 space-y-4">
          {tab.content?.map((child, childIndex) => (
            <UIRenderer
              key={childIndex}
              component={child}
              onAction={onAction}
              formValues={formValues}
              onFormChange={onFormChange}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
