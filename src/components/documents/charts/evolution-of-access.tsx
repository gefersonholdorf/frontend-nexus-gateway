"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardChart } from "./card-chart"
import { useTheme } from "@/contexts/theme-context"

const chartData = [
  { month: "January", access: 186 },
  { month: "February", access: 305 },
  { month: "March", access: 237 },
  { month: "April", access: 73 },
  { month: "May", access: 209 },
  { month: "June", access: 214 },
]

const chartConfig = {
  access: {
    label: "Acessos",
    color: "#3790E7",
  }
} satisfies ChartConfig

export function EvolutionOfAccessChart() {
  const { theme } = useTheme()
  return (
    <CardChart title="Evolução de Acesso" description="Acessos aos documentos ao longo do tempo">
        <ChartContainer config={chartConfig} className="w-full h-50">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: `${theme === 'dark' ? '#fff' : '#000'}`, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="access"
              type="natural"
              stroke="#3790E7"
              strokeWidth={2}
              dot={{
                fill: "#3790E7",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
    </CardChart>
  )
}
