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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const chartConfig = {
  total: {
    label: "Acessos",
    color: "#2563EB",
  },
} satisfies ChartConfig;

interface ConsultationRankingChartProps {
  usersRanking: {
    id: number;
    name: string;
    avatarUrl: string | null;
    total: number;
  }[];
}

export function ConsultationRankingChart({
  usersRanking,
}: ConsultationRankingChartProps) {
  return (
    <CardChart
      title="Ranking de Acesso por Usuários"
      description="Ranking de acessos aos documentos por usuários"
    >
      <div className="flex flex-col gap-4 w-full">
        <ChartContainer config={chartConfig} className="h-50 w-full">
          <BarChart
            accessibilityLayer
            data={usersRanking}
            margin={{
              top: 25,
              left: 10,
              right: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="name"
              tick={false}
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              fill="#3B82F6"
            >
              <LabelList
                dataKey="total"
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                fontWeight={600}
              />

              {usersRanking.map((_, index) => (
                <Cell
                  key={index}
                  fill="#3B82F6"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="flex w-full items-start -mt-5">
  {usersRanking.map((user) => (
    <div
      key={user.id}
      className="flex flex-1 flex-col items-center gap-1"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatarUrl ?? undefined} />
        <AvatarFallback className="text-[10px]">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <span
        className="w-full truncate text-center text-[11px] leading-tight"
        title={user.name}
      >
        {user.name}
      </span>
    </div>
  ))}
</div>
      </div>
    </CardChart>
  );
}