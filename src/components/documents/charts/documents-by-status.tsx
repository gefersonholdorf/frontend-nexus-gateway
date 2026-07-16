import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CardChart } from "./card-chart";
import { useTheme } from "@/contexts/theme-context";

const chartConfig = {
  total: {
    label: "Documentos",
    color: "#2563EB",
  },
} satisfies ChartConfig;

interface DocumentsByStatusChartProps {
  documentsByStatus: {
    name: string;
    total: number;
  }[];
}

export function DocumentsByStatusChart({
  documentsByStatus,
}: DocumentsByStatusChartProps) {
  const { theme } = useTheme();

  const statusGradient: Record<string, string> = {
    Vigente: "url(#gradient-vigente)",
    "Em Andamento": "url(#gradient-andamento)",
    "Em Revisão": "url(#gradient-revisao)",
    Pendente: "url(#gradient-pendente)",
  };

  return (
    <CardChart
      title="Documentos por Status"
      description="Distribuição de documentos por status"
    >
      <ChartContainer config={chartConfig} className="h-50 w-full">
        <BarChart
          accessibilityLayer
          data={documentsByStatus}
          margin={{
            top: 40,
            left: 10,
            right: 10,
          }}
        >
          <defs>
            <linearGradient id="gradient-vigente">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>

            <linearGradient id="gradient-andamento">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <linearGradient id="gradient-revisao">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="gradient-pendente">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="name"
            tick={{
              fill: theme === "dark" ? "#FFF" : "#000",
              fontSize: 12,
            }}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {documentsByStatus.map((item, index) => (
              <Cell
                key={index}
                fill={statusGradient[item.name] ?? "#64748B"}
              />
            ))}

            <LabelList
              dataKey="total"
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardChart>
  );
}