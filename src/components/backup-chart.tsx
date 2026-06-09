import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
export const description = "A radial chart with a custom shape"

const chartData = [
    {
        name: "background",
        value: 100,
        fill: "#fff",
    },
    {
        name: "progress",
        value: 80,
        fill: "#00BC7D",
    },
]

const chartConfig = {
    visitors: {
        label: "Taxa de Sucesso",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig
export function BackupGaugeChart() {
    return (
        <Card className="flex flex-col h-fit p-0 border-transparent outline-transparent">
            <CardContent className="flex-1 w-full p-0 m-0 border-transparent justify-center items-center">
                <ChartContainer
                    config={chartConfig}
                    className="p-0 flex items-center border-transparent justify-center w-full max-h-47.5"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={50}
                        outerRadius={85}
                        barSize={90}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:white last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar
                            dataKey="value"
                            cornerRadius={20}
                            background
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                                                    className="fill-emerald-700 text-4xl font-bold"
                                                >
                                                    {chartData[1].value.toLocaleString()} %
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Taxa de Sucesso
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}