export type TextVariant = "title" | "subtitle" | "body" | "caption" | "code";
export type TextAlign = "start" | "center" | "end" | "justify";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type BulletType = "disc" | "circle" | "square" | "decimal" | "none";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type InputType = "text" | "email" | "password" | "number" | "tel" | "url";
export type ChartType = "bar" | "line" | "area" | "pie";
export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
export type AlertVariant = "default" | "success" | "warning" | "error" | "info";
export type SeparatorOrientation = "horizontal" | "vertical";

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  color?: string | null;
}

export interface TextComponent {
  type: "text";
  text?: string;
  variant?: TextVariant;
  align?: TextAlign;
  style?: TextStyle;
}

export interface FlexComponent {
  type: "flex";
  direction?: "row" | "column";
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
  children?: UIComponent[];
}

export interface ImageComponent {
  type: "image";
  src?: string | null;
  searchQuery?: string | null;
  alt?: string;
  fit?: ImageFit;
  radius?: number;
}

export interface ListComponent {
  type: "list";
  ordered?: boolean;
  bulletType?: BulletType;
  children?: UIComponent[];
}

export interface ButtonComponent {
  type: "button";
  label?: string;
  action?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export interface InputComponent {
  type: "input";
  id?: string;
  label?: string;
  placeholder?: string;
  inputType?: InputType;
  required?: boolean;
}

export interface TextareaComponent {
  type: "textarea";
  id?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface SelectOption {
  value?: string;
  label?: string;
}

export interface SelectComponent {
  type: "select";
  id?: string;
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  required?: boolean;
}

export interface ChartYKey {
  key?: string;
  label?: string;
  color?: string;
}

export interface ChartConfig {
  xKey?: string;
  yKeys?: ChartYKey[];
}

export interface ChartComponent {
  type: "chart";
  chartType?: ChartType;
  title?: string;
  description?: string;
  data?: Record<string, string | number>[];
  config?: ChartConfig;
}

export interface BadgeComponent {
  type: "badge";
  text?: string;
  variant?: BadgeVariant;
}

export interface ProgressComponent {
  type: "progress";
  value?: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
}

export interface AlertComponent {
  type: "alert";
  title?: string;
  description?: string;
  variant?: AlertVariant;
}

export interface SeparatorComponent {
  type: "separator";
  orientation?: SeparatorOrientation;
}

export interface AccordionItem {
  title?: string;
  content?: UIComponent[];
}

export interface AccordionComponent {
  type: "accordion";
  items?: AccordionItem[];
  allowMultiple?: boolean;
}

export interface TabItem {
  label?: string;
  content?: UIComponent[];
}

export interface TabsComponent {
  type: "tabs";
  tabs?: TabItem[];
}

export interface CodeBlockComponent {
  type: "codeblock";
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
}

export interface CardComponent {
  type: "card";
  title?: string;
  description?: string;
  image?: string;
  imageQuery?: string;
  children?: UIComponent[];
  clickAction?: string;
}

export interface GridComponent {
  type: "grid";
  columns?: number;
  children?: UIComponent[];
}

export interface HeroComponent {
  type: "hero";
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundImageQuery?: string;
  overlayColor?: string;
  children?: UIComponent[];
}

export interface StatItem {
  label?: string;
  value?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  icon?: string;
}

export interface StatsComponent {
  type: "stats";
  items?: StatItem[];
}

export interface MetricComponent {
  type: "metric";
  label?: string;
  value?: string;
  change?: string;
  trend?: "up" | "down";
  prefix?: string;
  suffix?: string;
  description?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

export interface ComparisonItem {
  label?: string;
  subtitle?: string;
  children?: UIComponent[];
}

export interface ComparisonComponent {
  type: "comparison";
  title?: string;
  items?: ComparisonItem[];
}

export interface GalleryImage {
  image?: string;
  imageQuery?: string;
  title?: string;
  subtitle?: string;
  clickAction?: string;
}

export interface GalleryComponent {
  type: "gallery";
  title?: string;
  images?: GalleryImage[];
  columns?: number;
  aspectRatio?: string;
}

export interface TimelineItem {
  date?: string;
  title?: string;
  description?: string;
  active?: boolean;
  children?: UIComponent[];
}

export interface TimelineComponent {
  type: "timeline";
  items?: TimelineItem[];
  variant?: "vertical" | "horizontal";
}

export interface FeatureComponent {
  type: "feature";
  title?: string;
  description?: string;
  icon?: string;
  features?: (string | UIComponent)[];
  variant?: "default" | "primary" | "dark";
}

export type UIComponent =
  | TextComponent
  | FlexComponent
  | ImageComponent
  | ListComponent
  | ButtonComponent
  | InputComponent
  | TextareaComponent
  | SelectComponent
  | ChartComponent
  | BadgeComponent
  | ProgressComponent
  | AlertComponent
  | SeparatorComponent
  | AccordionComponent
  | TabsComponent
  | CodeBlockComponent
  | CardComponent
  | GridComponent
  | HeroComponent
  | StatsComponent
  | MetricComponent
  | ComparisonComponent
  | GalleryComponent
  | TimelineComponent
  | FeatureComponent;

export interface ResponseRoot {
  version: number;
  children?: UIComponent[];
}
