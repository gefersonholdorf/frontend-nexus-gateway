"use client"

import { Pie, PieChart, Label } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardChart } from "./card-chart"
import { SummaryCategories } from "./summary-categories"

const chartConfig = {
  total: {
    label: "Documentos",
  },
  Procedimento: {
    label: "Procedimento",
    color: "#F59E0B",
  },
  Manual: {
    label: "Manual",
    color: "#2F81F7",
  },
  Politica: {
    label: "Política",
    color: "#FF2C2C",
  },
} satisfies ChartConfig

const chartData = [
  {
    category: "Procedimento",
    total: 10,
    fill: chartConfig.Procedimento.color,
  },
  {
    category: "Politica",
    total: 15,
    fill: chartConfig.Politica.color,
  },
  {
    category: "Manual",
    total: 5,
    fill: chartConfig.Manual.color,
  },
]

export function DocumentsByCategoryChart() {
  const totalDocuments = chartData.reduce(
    (acc, item) => acc + item.total,
    0
  )

  return (
    <CardChart
      title="Documentos por Categoria"
      description="Distribuição de documentos por categoria"
    >
      <ChartContainer
        config={chartConfig}
        className="w-45 h-50"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name) => [
                  `${value} documentos`,
                  name,
                ]}
              />
            }
          />

          <Pie
            data={chartData}
            dataKey="total"
            nameKey="category"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={6}
            strokeWidth={2}
          >
            <Label
              content={({ viewBox }) => {
                if (
                  viewBox &&
                  "cx" in viewBox &&
                  "cy" in viewBox
                ) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalDocuments}
                      </tspan>

                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 22}
                        className="fill-muted-foreground text-sm"
                      >
                        Documentos
                      </tspan>
                    </text>
                  )
                }

                return null
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <SummaryCategories />
    </CardChart>
  )
}