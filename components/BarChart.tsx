"use client";

type BarChartData = {
  label: string;
  value: number;
  color?: string;
};

type BarChartProps = {
  data: BarChartData[];
  height?: number;
};

export const BarChart = ({ data, height = 60 }: BarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 0);
  if (maxValue === 0) return null;

  return (
    <div
      className="w-full flex items-end gap-2"
      style={{ height: `${height}px` }}
    >
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1 group"
          >
            <div
              className="w-full rounded-sm transition-all"
              style={{
                height: `${barHeight}%`,
                backgroundColor: item.color || "hsl(var(--primary))",
              }}
            ></div>
            <span className="text-xs text-muted-foreground truncate group-hover:text-foreground">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
