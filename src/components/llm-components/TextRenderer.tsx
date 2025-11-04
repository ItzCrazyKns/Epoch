import { cn } from "@/lib/utils";
import { TextComponent } from "./types";

export function TextRenderer({ component }: { component: TextComponent }) {
  const { text = "", variant = "body", align = "start", style = {} } = component;

  if (!text) return null;

  const alignmentClasses = {
    start: "text-left",
    center: "text-center",
    end: "text-right",
    justify: "text-justify",
  };

  const variantClasses = {
    title: "text-2xl font-bold text-gray-900 leading-tight",
    subtitle: "text-lg font-semibold text-gray-800 leading-snug",
    body: "text-sm text-gray-700 leading-relaxed",
    caption: "text-xs text-gray-500 leading-normal",
    code: "text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 border border-gray-200",
  };

  const className = cn(
    variantClasses[variant],
    alignmentClasses[align],
    style?.bold && "!font-bold",
    style?.italic && "italic",
    style?.underline && "underline underline-offset-2",
    style?.strike && "line-through",
    style?.code && "font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200",
  );

  const styleObj = style?.color ? { color: style.color } : undefined;

  return (
    <p className={className} style={styleObj}>
      {text}
    </p>
  );
}
