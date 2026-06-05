"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "./ui/skeleton"
import { useQuery } from "@tanstack/react-query"

export const description = "An interactive area chart"

interface IncidentsResponse {
    period: {
        days: number
        startDate: string
        endDate: string
    }
    timeline: {
        date: string
        disaster: number
        high: number
        average: number
        warning: number
        information: number
    }[]
}

const chartConfig = {
    disaster: {
        label: "Disaster",
        color: "#ef4444", // red-500
    },
    high: {
        label: "High",
        color: "#f97316", // orange-500
    },
    average: {
        label: "Average",
        color: "#eab308", // yellow-500
    },
    warning: {
        label: "Warning",
        color: "#3b82f6", // blue-500
    },
    information: {
        label: "Information",
        color: "#94a3b8", // slate-400
    },
} satisfies ChartConfig

export function ChartIncidentsComponent() {
    const [timeRange, setTimeRange] = React.useState("7d")

    const query = useQuery({
        queryKey: ["incidents-timeline", timeRange],
        queryFn: async () => {
            const days =
                timeRange === "7d"
                    ? 7
                    : timeRange === "30d"
                        ? 30
                        : 90

            const response = await fetch(
                "http://127.0.0.1:3336/problems/timeline",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hostIds: [10654, 10653, 10656],
                        days,
                    }),
                }
            )

            return response.json() as Promise<IncidentsResponse>
        },
        refetchInterval: 30000,
    })

    if (query.isLoading) {
        return (
            <Card className="h-90 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        )
    }

    if (!query.data) {
        return null
    }

    return (
        <Card className="h-100 pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 px-2 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Incidentes por Severidade</CardTitle>
                    <CardDescription>
                        Histórico de incidentes do período selecionado
                    </CardDescription>
                </div>

                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="hidden w-[160px] rounded-lg sm:flex">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="90d">Últimos 90 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="h-50 px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="h-50 w-full"
                >
                    <AreaChart data={query.data.timeline}>
                        <defs>
                            <linearGradient id="fillDisaster" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.16} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="fillAverage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.14} />
                                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="fillWarning" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.14} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="fillInformation" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.10} />
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            horizontal={true}
                            strokeDasharray="3 3"
                            stroke="rgba(148,163,184,.08)"
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            tick={{
                                fill: "#94A3B8",
                                fontSize: 12,
                            }}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                })
                            }
                        />

                        <YAxis
                            allowDecimals={false}
                            domain={[0, (dataMax: number) => dataMax + 5]}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("pt-BR")
                                    }
                                />
                            }
                        />

                        <Area
                            dataKey="information"
                            type="natural"
                            fill="url(#fillInformation)"
                            stroke="#94a3b8"
                            strokeWidth={2}
                        />

                        <Area
                            dataKey="warning"
                            type="natural"
                            fill="url(#fillWarning)"
                            stroke="#3b82f6"
                            strokeWidth={2}
                        />

                        <Area
                            dataKey="average"
                            type="natural"
                            fill="url(#fillAverage)"
                            stroke="#eab308"
                            strokeWidth={2}
                        />

                        <Area
                            dataKey="high"
                            type="natural"
                            fill="url(#fillHigh)"
                            stroke="#f97316"
                            strokeWidth={2}
                        />

                        <Area
                            dataKey="disaster"
                            type="natural"
                            fill="url(#fillDisaster)"
                            stroke="#ef4444"
                            strokeWidth={2}
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
