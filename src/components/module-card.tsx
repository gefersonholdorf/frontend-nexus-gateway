import { LayoutDashboard, MoveRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"

interface ModuleCardProps {
    title: string
    description: string
    page?: string
    redirection?: string
}

export function ModuleCard({ title, description, page, redirection }: ModuleCardProps) {
    const navigate = useNavigate()

    return (
        <div className="w-full flex justify-center items-center">
            <Card
                className="
                        w-90
                        h-62
                        flex flex-col justify-between
                        rounded-2xl px-0 pt-0 shadow-lg
                        border border-transparent
                        transition-all duration-300
                        transform hover:scale-[1.01]
                        hover:shadow-lg
                    ">
                <CardHeader className="flex flex-col items-center justify-center gap-2 pt-4 px-4 space-y-1 border-zinc-200 ">
                    <div className="w-10 h-10 border border-blue-300 rounded-md overflow-hidden flex items-center justify-center bg-blue-50">
                        <LayoutDashboard className="text-blue-500" />
                    </div>

                    <div className="flex flex-col justify-center items-center gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                            {title}
                        </CardTitle>

                        <p className="text-[.8rem] text-muted-foreground text-center">
                            {description}
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 mt-0 pt-0 px-4 flex flex-col justify-center items-center">
                    <Button
                        className="
                                cursor-pointer w-full gap-2
                                px-0
                                bg-transparent
                                text-blue-500
                                hover:text-blue-500
                                hover:bg-transparent
                                flex justify-center
                                transition-all duration-300
                            "
                        onClick={() => {
                            if (page) {
                                navigate(`/${page}`)
                                return
                            }

                            if (redirection) {
                                window.open(redirection, "_blank")
                            }
                        }}
                    >
                        Acessar módulo
                        <MoveRight size={16} />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}