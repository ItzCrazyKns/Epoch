import { cn } from "@/lib/utils";
import { ListComponent } from "./types";
import { UIRenderer } from "./UIRenderer";

interface ListRendererProps {
  component: ListComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function ListRenderer({ component, onAction, formValues, onFormChange }: ListRendererProps) {
  const { ordered = false, bulletType = "disc", children = [] } = component;

  const bulletTypeClasses = {
    disc: "list-disc",
    circle: "list-circle",
    square: "list-square",
    decimal: "list-decimal",
    none: "list-none",
  };

  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag className={cn(
      "space-y-2 ml-5",
      bulletTypeClasses[bulletType]
    )}>
      {children.map((child, index) => (
        <li key={index} className="text-gray-700">
          <UIRenderer
            component={child}
            onAction={onAction}
            formValues={formValues}
            onFormChange={onFormChange}
          />
        </li>
      ))}
    </ListTag>
  );
}
