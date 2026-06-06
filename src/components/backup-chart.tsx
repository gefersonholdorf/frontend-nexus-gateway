"use client"

import {
    Label,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"


import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"

const backupOk = 70
const backupError = 30

const total = backupOk + backupError
const successPercentage = Math.round((backupOk / total) * 100)

const chartData = [
    {
        name: "Backups",
        ok: backupOk,
        erro: backupError,
    },
]

const chartConfig = {
    ok: {
        label: "OK",
        color: "#16a34a",
    },
    erro: {
        label: "Erro",
        color: "#ef4444",
    },
} satisfies ChartConfig

export function BackupGaugeChart() {
    return (
        <div className="flex flex-col border-transparent outline-none w-full h-fit p-0 m-0 shadow-none -pb-8">
            <ChartContainer
                config={chartConfig}
                className="flex justify-center items-center h-35 p-0"
            >
                <RadialBarChart
                    className=""
                    data={chartData}
                    innerRadius={70}
                    outerRadius={50}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar
                        dataKey="erro"
                        stackId="a"
                        fill="#ef4444"
                    />

                    <RadialBar
                        dataKey="ok"
                        stackId="a"
                        fill="#10B981"
                        cornerRadius={5}
                    />

                    <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                        className=""
                    >
                        <Label
                            className=""
                            content={({ viewBox }) => {
                                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                                    return null

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
                                            className="fill-foreground text-4xl font-bold"
                                        >
                                            {successPercentage}%
                                        </tspan>

                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Taxa de Sucesso de Backups
                                        </tspan>

                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy + 44}
                                            className="fill-muted-foreground text-xs"
                                        >
                                            {backupOk}% OK • {backupError}% Erro
                                        </tspan>
                                    </text>
                                )
                            }}
                        />
                    </PolarRadiusAxis>
                </RadialBarChart>
            </ChartContainer>
        </div >
    )
}