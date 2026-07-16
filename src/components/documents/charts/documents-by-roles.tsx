"use client";

import { Cell, Legend, Pie, PieChart } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { CardChart } from "./card-chart";

interface DocumentsByRolesChartProps {
    documentsByRolesPercentual: {
        name: string;
        total: number;
    }[];
}

const colors = [
    "#2563EB", // Blue
    "#0F766E", // Teal
    "#16A34A", // Green
    "#F59E0B", // Amber
    "#9333EA", // Purple
    "#DC2626", // Red
    "#0891B2", // Cyan
    "#64748B", // Slate
    "#EA580C", // Orange
    "#4F46E5", // Indigo
];

export function DocumentsByRolesChart({
    documentsByRolesPercentual,
}: DocumentsByRolesChartProps) {
    const chartData = documentsByRolesPercentual.map((item, index) => ({
        role: item.name,
        documents: item.total,
        fill: colors[index % colors.length],
    }));

    const chartConfig = Object.fromEntries(
        chartData.map((item) => [
            item.role,
            {
                label: item.role,
                color: item.fill,
            },
        ])
    ) satisfies ChartConfig;

    return (
        <CardChart
            title="Documentos por Área"
            description="Distribuição de documentos por área da empresa"
        >
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-79 w-full"
            >
                <PieChart>
                    <defs>
                        {colors.map((color, index) => (
                            <linearGradient
                                key={index}
                                id={`gradient-${index}`}
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                            >
                                <stop offset="0%" stopColor={color} stopOpacity={1} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.55} />
                            </linearGradient>
                        ))}
                    </defs>
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, _, item) => [
                                    `${value}% `,
                                    item.payload.role,
                                ]}
                            />
                        }
                    />

                    <Pie
                        data={chartData}
                        dataKey="documents"
                        nameKey="role"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={6}
                        label={({
                            cx = 0,
                            cy = 0,
                            midAngle = 0,
                            outerRadius = 0,
                            value = 0,
                        }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = outerRadius + 18;

                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="currentColor"
                                    fontSize={12}
                                    fontWeight={600}
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                    className="text-foreground"
                                >
                                    {value}%
                                </text>
                            );
                        }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.fill}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>

                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-sm text-muted-foreground">{value}</span>
                        )}
                    />
                </PieChart>
            </ChartContainer>
        </CardChart>
    );
}