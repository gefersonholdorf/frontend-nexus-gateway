"use client"

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CardChart } from "./card-chart"
import { useTheme } from "@/contexts/theme-context"

export const description = "A horizontal bar chart"

const chartData = [
  {
    user: {
      id: 1,
      name: "Geferson Holdorf",
      avatarUrl:
        "https://api2.lusati.com.br/repositorio/nexus/avatar_geferson.PNG",
    },
    quantity: 250,
  },
  {
    user: {
      id: 2,
      name: "Marcelo Verdi",
      avatarUrl:
        "https://api2.lusati.com.br/repositorio/nexus/avatar_marcelo.PNG",
    },
    quantity: 201,
  },
  {
    user: {
      id: 3,
      name: "Roberto Amorim",
      avatarUrl:
        "https://api2.lusati.com.br/repositorio/nexus/avatar_roberto.PNG",
    },
    quantity: 100,
  },
  {
    user: {
      id: 4,
      name: "Bruno Busarello",
      avatarUrl:
        "https://api2.lusati.com.br/repositorio/nexus/avatar_bruno.PNG",
    },
    quantity: 5,
  },
  {
    user: {
      id: 5,
      name: "Vitor Helker",
      avatarUrl:
        "https://api2.lusati.com.br/repositorio/nexus/avatar_vitor.PNG",
    },
    quantity: 2,
  },
  {
    user: {
      id: 6,
      name: "Leandro Santos",
      avatarUrl:
        "https://api2.lusati.com.br/repositorio/nexus/avatar_leandro.PNG",
    },
    quantity: 1,
  },
]

const chartConfig = {
  quantity: {
    label: "Consultas",
    color: "#2563EB",
  },
} satisfies ChartConfig

export function ConsultationRankingChart() {
  const { theme } = useTheme()

  return (
    <CardChart
      title="Usuários que mais consultam"
      description="Ranking por número de acessos a documentos"
    >
      <ChartContainer
        config={chartConfig}
        className="w-full h-80"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          barCategoryGap={18}
          margin={{
            top: 4,
            right: 25,
            bottom: 4,
            left: 10,
          }}
        >
          <defs>
            <linearGradient id="barLight" x1="0" x2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#2F81F7" />
            </linearGradient>

            <linearGradient id="barDark" x1="0" x2="1">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#2F81F7" />
            </linearGradient>
          </defs>

          <XAxis type="number" hide />

          <YAxis
            dataKey="user.name"
            type="category"
            width={44}
            tick={<CustomYAxisTick theme={theme} />}
            axisLine={false}
            tickLine={false}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar
            dataKey="quantity"
            radius={6}
            barSize={30}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={`url(#${theme === "dark" ? "barDark" : "barLight"})`}
              />
            ))}

            {/* <LabelList
              content={({ x, y, width, height, index }: any) => {
                const item = chartData[index];

                if (!item) return null;

                const MIN_WIDTH = 120;

                const textX =
                  width >= MIN_WIDTH
                    ? x + 10               // dentro da barra
                    : x + MIN_WIDTH + 10;  // após um tamanho mínimo

                return (
                  <text
                    x={textX}
                    y={y + height / 2}
                    dominantBaseline="middle"
                    fill={width >= MIN_WIDTH ? "#fff" : theme === "dark" ? "#F9FAFB" : "#111827"}
                    fontSize={12}
                    fontWeight={600}
                  >
                    {item.user.name}
                  </text>
                );
              }}
            /> */}

            <LabelList
              dataKey="quantity"
              position="right"
              style={{
                fill:
                  theme === "dark"
                    ? "#D1D5DB"
                    : "#374151",
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardChart>
  )
}

function CustomYAxisTick({
  x,
  y,
  payload,
  theme,
}: any) {
  const item = chartData.find(
    (d) => d.user.name === payload.value
  )

  if (!item) return null

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{item.user.name}</title>

      <circle
        cx={-20}
        cy={0}
        r={15}
        fill={theme === "dark" ? "#1F2937" : "#FFFFFF"}
        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
        strokeWidth={2}
      />

      <image
        href={item.user.avatarUrl}
        x={-40}
        y={-20}
        width={40}
        height={40}
        clipPath="circle()"
      />
    </g>
  )
}