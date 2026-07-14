"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardChart } from "./card-chart"
import { useTheme } from "@/contexts/theme-context"

export const description = "A horizontal bar chart"

const chartData = [
  { month: "Geferson Holdorf", desktop: 186 },
  { month: "Marcelo Verdi", desktop: 305 },
  { month: "Roberto Amorim", desktop: 237 },
  { month: "Bruno Busarello", desktop: 73 },
  { month: "Vitor Helker", desktop: 209 },
  { month: "Leandro Santos", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3790E7",
  },
} satisfies ChartConfig

export function ConsultationRankingChart() {
  const { theme } = useTheme()
  return (
    <CardChart title="Usuários que mais consultam" description="Ranking por número de acessos a documentos">
        <ChartContainer config={chartConfig} className="w-full h-50">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <XAxis type="number" dataKey="desktop" hide />
            <YAxis
              className="border border-border w-70 text-sm text-primary-text"
              dataKey="month"
              type="category"
              tickLine={false}
              tick={{ fill: `${theme === 'dark' ? '#fff' : '#000'}`, fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="#3790E7" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardChart>
  )
}
