"use client";
import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    theme?: Record<string, string>;
  };
}

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  children: React.ReactElement;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border/50",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>
          {React.cloneElement(children)}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorVars = Object.entries(config)
    .filter(([, item]) => item.color || item.theme)
    .map(([key, item]) => `--color-${key}: ${item.color};`)
    .join("\n");

  return colorVars ? (
    <style>{`[data-chart=${id}] { ${colorVars} }`}</style>
  ) : null;
};

interface TooltipContentProps {
  active?: boolean;
  payload?: any[];
  className?: string;
  indicator?: "dot" | "line" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  formatter?: (value: any, name: string) => React.ReactNode;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  formatter,
}: TooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className={cn("bg-background rounded-lg border p-2 shadow", className)}>
      {!hideLabel && label && (
        <div className="font-medium mb-2">{label}</div>
      )}
      <div className="space-y-1">
        {payload.map((item) => {
          const itemConfig = config[item.name] || {};
          const IconComponent = itemConfig.icon;
          return (
            <div key={item.name} className="flex items-center gap-2">
              {!hideIndicator && (
                IconComponent ? (
                  <IconComponent className="h-3 w-3" />
                ) : (
                  <div
                    className={cn("h-2 w-2 rounded", {
                      "w-1": indicator === "line",
                      "border border-dashed": indicator === "dashed",
                    })}
                    style={{ backgroundColor: item.color }}
                  />
                )
              )}
              <span>{itemConfig.label || item.name}</span>
              <span className="ml-auto font-mono">
                {formatter ? formatter(item.value, item.name) : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface LegendContentProps {
  payload?: any[];
  className?: string;
  hideIcon?: boolean;
}

function ChartLegendContent({
  payload,
  className,
  hideIcon = false,
}: LegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-4 justify-center", className)}>
      {payload.map((item) => {
        const itemConfig = config[item.value] || {};
        const IconComponent = itemConfig.icon;
        return (
          <div key={item.value} className="flex items-center gap-1.5">
            {!hideIcon && IconComponent ? (
              <IconComponent className="h-3 w-3" />
            ) : (
              <div
                className="h-2 w-2 rounded"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{itemConfig.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// Создаем обертки для компонентов Recharts
const ChartTooltip = (props: React.ComponentProps<typeof RechartsTooltip>) => (
  <RechartsTooltip content={<ChartTooltipContent />} {...props} />
);

const ChartLegend = (props: React.ComponentProps<typeof RechartsLegend>) => (
  <RechartsLegend content={<ChartLegendContent />} {...props} />
);

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
