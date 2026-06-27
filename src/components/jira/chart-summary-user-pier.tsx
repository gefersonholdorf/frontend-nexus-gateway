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
    color: "#D4A017",
  },
  "Em Andamento": {
    label: "Em Andamento",
    color: "#3B82F6",
  },
  Correção: {
    label: "Correção",
    color: "#E11D48",
  },
  Concluído: {
    label: "Concluído",
    color: "#10B981",
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
      fill: "#D4A017", // Amber Gold Premium
    },
    {
      status: "Em Andamento",
      total: summary.inProgress,
      fill: "#3B82F6", // Blue
    },
    {
      status: "Correção",
      total: summary.correction,
      fill: "#E11D48", // Rose Red Premium
    },
    {
      status: "Concluído",
      total: summary.completed,
      fill: "#10B981", // Emerald
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