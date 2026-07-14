import { Card } from "@/components/ui/card";
import { useState } from "react";

export function Period() {
    const [ period, setPeriod ] = useState(1)

    const periods = [
        {
            id: 1,
            title: "Últimos 7 dias",
            active: period === 1
        },
        {
            id: 2,
            title: "Últimos 30 dias",
            active: period === 2
        },
        {
            id: 3,
            title: "Últimos 90 dias",
            active: period === 3
        },
        {
            id: 4,
            title: "Último ano",
            active: period === 4
        }
    ]

    function handleSetPeriod(id: number) {
        setPeriod(id)
    }

    return (
        <Card className="bg-(image:--background-gradient) p-2 px-4 w-fit h-fit rounded-lg border border-border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex gap-3">
                {periods.map((period) => (
                    <div 
                        key={period.id} 
                        className={`text-center px-4 py-1 rounded-sm cursor-pointer ${period.active ? 'bg-primary' : 'hover:bg-primary/60'}`}
                        onClick={() => handleSetPeriod(period.id)}
                    >
                        
                        {period.title}
                    </div>
                ))}
            </div>
        </Card>
    )
}