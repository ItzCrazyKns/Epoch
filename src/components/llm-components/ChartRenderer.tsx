"use client";

import { ChartComponent } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartRendererProps {
  component: ChartComponent;
  isInFlexRow?: boolean;
}

export function ChartRenderer({ component, isInFlexRow = false }: ChartRendererProps) {
  const {
    chartType = "bar",
    title,
    description,
    data,
    config,
  } = component;

  if (!data || !config || !config.xKey || !config.yKeys || config.yKeys.length === 0) {
    return null;
  }

  const xKey = config.xKey;
  const yKeys = config.yKeys;

  const chartConfig = yKeys.reduce((acc, yKey) => {
    if (!yKey.key) return acc;
    acc[yKey.key] = {
      label: yKey.label || yKey.key,
      color: yKey.color || "#8884d8",
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={xKey}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {yKeys.map((yKey) => (
                  <Bar
                    key={yKey.key}
                    dataKey={yKey.key!}
                    fill={yKey.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={xKey}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {yKeys.map((yKey) => (
                  <Line
                    key={yKey.key}
                    type="monotone"
                    dataKey={yKey.key!}
                    stroke={yKey.color}
                    strokeWidth={2}
                    dot={{ fill: yKey.color, r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "area":
        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={xKey}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} stroke="#9ca3af" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {yKeys.map((yKey, index) => (
                  <Area
                    key={yKey.key}
                    type="monotone"
                    dataKey={yKey.key!}
                    stroke={yKey.color}
                    fill={yKey.color}
                    fillOpacity={0.6}
                    stackId={index === 0 ? "1" : undefined}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case "pie":
        const firstYKey = yKeys[0].key;
        if (!firstYKey) return null;

        const pieData = data.map((item) => ({
          name: item[xKey] as string,
          value: item[firstYKey] as number,
        }));

        return (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={yKeys[index % yKeys.length]?.color || "#8884d8"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "shadow-sm border-gray-200",
      isInFlexRow ? "flex-1 min-w-0" : "w-full"
    )}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
          {description && (
            <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="pt-4">{renderChart()}</CardContent>
    </Card>
  );
}
