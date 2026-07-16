"use client"

import { Label, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardChart } from "./card-chart"
import { SummaryCategories } from "./summary-categories"

interface DocumentsByCategoryChartProps {
  documentsByCategory: {
    name: string
    total: number
  }[]
}

const chartConfig = {
  total: {
    label: "Documentos",
  },
} satisfies ChartConfig

const categoryColors: Record<string, string> = {
  Política: "#2563EB",
  Procedimento: "#10B981",
  Manual: "#F59E0B",
  PCN: "#8B5CF6",
}

const fallbackColors = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#64748B",
]

export function DocumentsByCategoryChart({
  documentsByCategory,
}: DocumentsByCategoryChartProps) {
  const chartData = documentsByCategory
    .filter((item) => item.total > 0)
    .map((item, index) => ({
      category: item.name,
      total: item.total,
      fill:
        categoryColors[item.name] ??
        fallbackColors[index % fallbackColors.length],
    }))

  const totalDocuments = chartData.reduce(
    (acc, item) => acc + item.total,
    0
  )

  if (chartData.length === 0) {
    return (
      <CardChart
        title="Documentos por Categoria"
        description="Distribuição de documentos por categoria"
      >
        <div className="flex h-50 items-center justify-center text-sm text-muted-foreground">
          Nenhum documento encontrado.
        </div>
      </CardChart>
    )
  }

  return (
    <CardChart
      title="Documentos por Categoria"
      description="Distribuição de documentos por categoria"
    >
      <ChartContainer
        config={chartConfig}
        className="h-50 w-45"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name) => [
                  `${value} `,
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
            paddingAngle={5}
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

      <SummaryCategories categories={chartData} />
    </CardChart>
  )
}