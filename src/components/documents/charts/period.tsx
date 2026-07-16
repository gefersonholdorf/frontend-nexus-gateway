import { Card } from "@/components/ui/card";

interface IPeriod {
    id: "7d" | "30d" | "1y" | "ds"
    title: string
    active: boolean
}

interface PeriodProps {
    period: "7d" | "30d" | "1y" | "ds"
    onSetPeriod: (period: "7d" | "30d" | "1y" | "ds") => void
}

export function Period({ period, onSetPeriod }: PeriodProps) {
    const periods: IPeriod[] = [
        {
            id: "7d",
            title: "Últimos 7 dias",
            active: period === "7d"
        },
        {
            id: "30d",
            title: "Últimos 30 dias",
            active: period === "30d"
        },
        {
            id: "1y",
            title: "Último ano",
            active: period === "1y"
        },
        {
            id: "ds",
            title: "Desde Sempre",
            active: period === "ds"
        },
    ]

    return (
        <Card className="bg-(image:--background-gradient) p-1 w-fit h-fit rounded-lg border border-border bg-card text-card-foreground hover:shadow-sm transition-shadow duration-300">
            <div className="flex gap-3">
                {periods.map((period) => (
                    <div
                        key={period.id}
                        className={`text-center text-primary-text text-sm px-4 py-1 rounded-lg cursor-pointer ${period.active ? 'bg-primary text-white' : 'hover:bg-primary/80 hover:text-white'}`}
                        onClick={() => onSetPeriod(period.id)}
                    >

                        <span className="text-[.9rem] font-normal">{period.title}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}