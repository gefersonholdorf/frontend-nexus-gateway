import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardChartProps {
    title: string
    description: string
    children: React.ReactNode;
}

export function CardChart({ title, description, children }: CardChartProps) {
    return (
        <Card className="w-full bg-(image:--background-gradient) p-4 px-4 h-fit rounded-lg border border-border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-[.85rem] text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent className="flex flex-row gap-4">
                {children}
            </CardContent>
        </Card>
    )
}