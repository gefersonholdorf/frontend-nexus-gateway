"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardChart } from "./card-chart"
import { useTheme } from "@/contexts/theme-context"

export const description = "A bar chart with a label"

const chartData = [
  { month: "Vigente", desktop: 186 },
  { month: "Pendente", desktop: 305 },
  { month: "Em Andamento", desktop: 237 },
  { month: "Em Revisão", desktop: 73 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3790E7",
  },
} satisfies ChartConfig

export function DocumentsByStatusChart() {
  const { theme } = useTheme()
  return (
    <CardChart title="Documentos por Status" description="Distribuição de documentos por status">
        <ChartContainer config={chartConfig} className="w-full h-50">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: `${theme === 'dark' ? '#fff' : '#000'}`, fontSize: 12 }}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="#3790E7" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardChart>
  )
}
