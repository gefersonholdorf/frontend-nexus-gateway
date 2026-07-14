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
        <Card className="bg-(image:--background-gradient) p-1 w-fit h-fit rounded-lg border border-border bg-card text-card-foreground hover:shadow-sm transition-shadow duration-300">
            <div className="flex gap-3">
                {periods.map((period) => (
                    <div 
                        key={period.id} 
                        className={`text-center text-primary-text text-sm px-4 py-1 rounded-lg cursor-pointer ${period.active ? 'bg-primary text-white' : 'hover:bg-primary/80 hover:text-white'}`}
                        onClick={() => handleSetPeriod(period.id)}
                    >
                        
                        <span className="text-[.9rem] font-normal">{period.title}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}