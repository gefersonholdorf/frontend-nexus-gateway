"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTheme } from "@/contexts/theme-context"
import { CardChart } from "./card-chart"

const chartConfig = {
  access: {
    label: "Acessos",
    color: "#3790E7",
  }
} satisfies ChartConfig

interface EvolutionOfAccessChartProps {
  evolutionAccess: {
    label: string,
    access: number
  }[],
}

export function EvolutionOfAccessChart({ evolutionAccess }: EvolutionOfAccessChartProps) {
  const { theme } = useTheme()
  const maxLabels = 7
  const interval = Math.max(
    0,
    Math.ceil(evolutionAccess.length / maxLabels) - 1
  )
  return (
    <CardChart title="Evolução de Acesso" description="Acessos aos documentos ao longo do tempo">
      <ChartContainer config={chartConfig} className="w-full h-63.5">
        <LineChart
          accessibilityLayer
          data={evolutionAccess}
          margin={{
            top: 20,
            left: -20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            interval={interval}
            tick={{
              fill: theme === "dark" ? "#fff" : "#000",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 6)}
          />
          <YAxis
            tick={{
              fill: theme === "dark" ? "#fff" : "#000",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
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
            {/* <LabelList
              content={({ index, x, y, value }) => {
                if (
                  index === undefined ||
                  typeof x !== "number" ||
                  typeof y !== "number"
                ) {
                  return null
                }
                if (
                  index % (interval + 1) !== 0 &&
                  index !== evolutionAccess.length - 1
                ) {
                  return null
                }

                return (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className="fill-foreground"
                    fontSize={12}
                  >
                    {value}
                  </text>
                )
              }}
            /> */}
          </Line>
        </LineChart>
      </ChartContainer>
    </CardChart>
  )
}
