import { ExternalLink } from "lucide-react"
import type React from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

interface SecurityCardProps {
    title: string
    description: string
    ip: string
    typeColor: 'black' | 'blue'
    children: React.ReactNode
}

export function SecurityCard({ title, description, ip, typeColor, children }: SecurityCardProps) {
    return (
        <Card
            className={`group rounded-2xl shadow-lg cursor-pointer border-t-5 border-transparent ${typeColor === 'black' ? 'hover:border-primary ' : 'hover:border-primary '} px-4 py-4 flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
            hover:shadow-lg h-fit space-y-4`}
            onClick={() => window.open(`http://${ip}`, "_blank")}
        >
            <CardHeader>
                <div className="w-12 h-12 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-background">
                    {children}
                </div>
            </CardHeader>
            <CardContent className="border-b-2 pb-4 space-y-1">
                <h4 className="font-bold text-lg text-primary-text group-hover:text-primary">{title}</h4>
                <p className="font-sm text-muted-foreground line-clamp-2 min-h-10">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className={`bg-primary/10 text-primary-text border border-bg-muted px-2 py-1 rounded-lg`}>
                    <span className={`text-[.8rem]`}>{ip}</span>
                </div>
                <Button className="bg-transparent cursor-pointer hover:bg-transparent hover:primary text-primary-text group-hover:text-primary">
                    Acessar
                    <ExternalLink />
                </Button>
            </CardFooter>
        </Card>
    )
}