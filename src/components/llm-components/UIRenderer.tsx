import { UIComponent } from "./types";
import { TextRenderer } from "./TextRenderer";
import { FlexRenderer } from "./FlexRenderer";
import { ImageRenderer } from "./ImageRenderer";
import { ListRenderer } from "./ListRenderer";
import { ButtonRenderer } from "./ButtonRenderer";
import { InputRenderer } from "./InputRenderer";
import { TextareaRenderer } from "./TextareaRenderer";
import { SelectRenderer } from "./SelectRenderer";
import { ChartRenderer } from "./ChartRenderer";
import { BadgeRenderer } from "./BadgeRenderer";
import { ProgressRenderer } from "./ProgressRenderer";
import { AlertRenderer } from "./AlertRenderer";
import { SeparatorRenderer } from "./SeparatorRenderer";
import { AccordionRenderer } from "./AccordionRenderer";
import { TabsRenderer } from "./TabsRenderer";
import { CodeBlockRenderer } from "./CodeBlockRenderer";
import { CardRenderer } from "./CardRenderer";
import { GridRenderer } from "./GridRenderer";
import { HeroRenderer } from "./HeroRenderer";
import { StatsRenderer } from "./StatsRenderer";
import { MetricRenderer } from "./MetricRenderer";
import { ComparisonRenderer } from "./ComparisonRenderer";
import { GalleryRenderer } from "./GalleryRenderer";
import { TimelineRenderer } from "./TimelineRenderer";
import { FeatureRenderer } from "./FeatureRenderer";

interface UIRendererProps {
  component: UIComponent;
  isInFlexRow?: boolean;
  isInGrid?: boolean;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
}

export function UIRenderer({
  component,
  isInFlexRow = false,
  isInGrid = false,
  onAction,
  formValues,
  onFormChange,
}: UIRendererProps) {
  switch (component.type) {
    case "text":
      return <TextRenderer component={component} />;
    case "flex":
      return (
        <FlexRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "image":
      return <ImageRenderer component={component} isInFlexRow={isInFlexRow} />;
    case "list":
      return (
        <ListRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "button":
      return <ButtonRenderer component={component} onAction={onAction} />;
    case "input":
      return (
        <InputRenderer
          component={component}
          value={component.id ? formValues?.[component.id] : undefined}
          onChange={onFormChange}
          isInFlexRow={isInFlexRow}
        />
      );
    case "textarea":
      return (
        <TextareaRenderer
          component={component}
          value={component.id ? formValues?.[component.id] : undefined}
          onChange={onFormChange}
          isInFlexRow={isInFlexRow}
        />
      );
    case "select":
      return (
        <SelectRenderer
          component={component}
          value={component.id ? formValues?.[component.id] : undefined}
          onChange={onFormChange}
          isInFlexRow={isInFlexRow}
        />
      );
    case "chart":
      return <ChartRenderer component={component} isInFlexRow={isInFlexRow} />;
    case "badge":
      return <BadgeRenderer component={component} />;
    case "progress":
      return <ProgressRenderer component={component} />;
    case "alert":
      return <AlertRenderer component={component} />;
    case "separator":
      return <SeparatorRenderer component={component} />;
    case "accordion":
      return (
        <AccordionRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "tabs":
      return (
        <TabsRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "codeblock":
      return <CodeBlockRenderer component={component} />;
    case "card":
      return (
        <CardRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
          isInGrid={isInGrid}
        />
      );
    case "grid":
      return (
        <GridRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "hero":
      return (
        <HeroRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "stats":
      return <StatsRenderer component={component} />;
    case "metric":
      return <MetricRenderer component={component} />;
    case "comparison":
      return (
        <ComparisonRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "gallery":
      return (
        <GalleryRenderer
          component={component}
          onAction={onAction}
        />
      );
    case "timeline":
      return (
        <TimelineRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    case "feature":
      return (
        <FeatureRenderer
          component={component}
          onAction={onAction}
          formValues={formValues}
          onFormChange={onFormChange}
        />
      );
    default:
      return null;
  }
}
