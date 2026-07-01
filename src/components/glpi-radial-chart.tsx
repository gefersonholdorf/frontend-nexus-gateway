"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { useTheme } from "@/contexts/theme-context"

const chartConfig = {
    total: {
        label: "Chamados",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

interface GLPIChartBarHorizontalProps {
    summary: {
        status: 'Aberto' | 'Em andamento' | 'Resolvido' | 'Fechado'
        value: number
    }[]
}

export function GLPIChartBarHorizontal({ summary }: GLPIChartBarHorizontalProps) {
    const { theme } = useTheme()

    const values = Object.fromEntries(
        summary.map(item => [item.status, item.value])
    )

    const chartData = [
        {
            status: "Aberto",
            total: values["Aberto"] ?? 0,
        },
        {
            status: "Em andamento",
            total: values["Em andamento"] ?? 0,
        },
        {
            status: "Aguardando Encerrar",
            total: values["Resolvido"] ?? 0,
        },
        {
            status: "Fechado",
            total: values["Fechado"] ?? 0,
        },
    ]
    return (
        <div>
            <div className="w-full flex flex-col">
                <ChartContainer
                    config={chartConfig}
                    className="h-50 w-full"
                >
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            top: 0,
                            right: 10,
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        <XAxis type="number" dataKey="total" hide />

                        <YAxis
                            dataKey="status"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={110}
                            tick={{
                                fill: theme === "dark" ? "#E5E7EB" : "#374151",
                            }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => [`${value}`, " Chamados"]}
                                />
                            }
                        />

                        <defs>
                            <linearGradient id="glpiBar" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#2563EB" />
                            </linearGradient>
                        </defs>

                        <Bar
                            dataKey="total"
                            fill="url(#glpiBar)"
                            radius={8}
                        >
                            <LabelList
                                dataKey="total"
                                position="center"
                                fill="#fff"
                                fontSize={18}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    )
}