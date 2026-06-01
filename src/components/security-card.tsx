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
            className={`group rounded-2xl cursor-pointer border-t-5 ${typeColor === 'black' ? 'border-gray-900 ' : 'border-blue-600 '} px-4 py-4 shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
            hover:shadow-lg h-fit space-y-4`}
            onClick={() => window.open(`http://${ip}`, "_blank")}
        >
            <CardHeader>
                <div className="w-12 h-12 border border-blue-200 rounded-md overflow-hidden flex items-center justify-center bg-blue-100">
                    {children}
                </div>
            </CardHeader>
            <CardContent className="border-b-2 pb-4 space-y-1">
                <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-500">{title}</h4>
                <p className="font-sm text-gray-600 line-clamp-2 min-h-10">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className={`${typeColor === 'black' ? 'bg-gray-100' : 'bg-blue-100'} px-2 py-1 rounded-lg`}>
                    <span className={`text-[.8rem] ${typeColor === 'black' ? 'text-gray-900' : 'text-blue-800'}`}>{ip}</span>
                </div>
                <Button className="bg-transparent cursor-pointer hover:bg-transparent hover:text-blue-800 text-blue-600">
                    Acessar
                    <ExternalLink />
                </Button>
            </CardFooter>
        </Card>
    )
}