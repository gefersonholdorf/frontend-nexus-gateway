"use client"

import * as React from "react"
import { Pie, PieChart, Label } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Tarefas",
  },
  Pendente: {
    label: "Pendente",
    color: "#F59E0B",
  },
  "Em Andamento": {
    label: "Em Andamento",
    color: "#2F81F7",
  },
  Correção: {
    label: "Correção",
    color: "#ff2c2c",
  },
  Concluído: {
    label: "Concluído",
    color: "#10b981",
  },
} satisfies ChartConfig

interface ChartSummaryUserPieProps {
  summary: {
    pending: number
    inProgress: number
    correction: number
    completed: number
  }
}

export function ChartSummaryUserPie({ summary }: ChartSummaryUserPieProps) {

  const chartData = [
  {
    status: "Pendente",
    total: summary.pending,
    fill: "#F59E0B",
  },
  {
    status: "Em Andamento",
    total: summary.inProgress,
    fill: "#2563EB",
  },
  {
    status: "Correção",
    total: summary.correction,
    fill: "#ff2c2c",
  },
  {
    status: "Concluído",
    total: summary.completed,
    fill: "#10b981",
  },
]

  const totalTasks = React.useMemo(() => {
    return chartData.reduce(
      (acc, item) => acc + item.total,
      0
    )
  }, [])

  return (
    <div className="w-50 bg-transparent outline-none shadow-none">
      <div className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5 border-none outline-none shadow-none"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${value} tarefas`,
                    name,
                  ]}
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="total"
              nameKey="status"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={4}
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
                          {totalTasks}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Tarefas
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
      </div>
    </div>
  )
}