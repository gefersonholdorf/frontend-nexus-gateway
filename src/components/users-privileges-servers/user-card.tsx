import { ChevronDown, ChevronUp, Edit, History, UserKey } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ServerCard } from "./server-card";
import { PrivilegesModal } from "./modals/privileges-modal";

interface UserCardProps {
    user: {
        id: number
        name: string
        user: string
        logo: string
    }
}

export function UserCard({ user }: UserCardProps) {
    const [expand, setExpand] = useState(false)

    function handleSetExpand() {
        setExpand(!expand)
    }
    return (
        <Card className="h-fit p-0 bg-(image:--background-gradient) rounded-2xl border border-border shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg">
            <CardHeader
                className="w-full flex gap-4 justify-between items-center p-6 cursor-pointer"
                onClick={handleSetExpand}
            >
                <div className="flex gap-2 items-center">
                    <Avatar className="w-10 h-10">
                        <AvatarImage className="h-10 w-10" src={user.logo} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <span className="text-[1.1rem] text-primary-text font-semibold">{user.name}</span>
                        <span className="text-[.8rem] text-muted-foreground">{user.user}</span>
                    </div>
                </div>
                <div className="flex gap-6 items-center">
                    <Tooltip>
                        <TooltipTrigger>
                            <History className="text-muted-foreground size-5 hover:text-blue-500 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Ver Histórico</span>
                        </TooltipContent>
                    </Tooltip>
                    <PrivilegesModal>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <UserKey className="text-muted-foreground size-5 hover:text-blue-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Dar Privilégio</span>
                            </TooltipContent>
                        </Tooltip>
                    </PrivilegesModal>
                    <Tooltip>
                        <TooltipTrigger>
                            <Edit className="text-muted-foreground size-5 hover:text-blue-500 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Atualizar Usuário</span>
                        </TooltipContent>
                    </Tooltip>
                    <div className="p-2 hover:bg-primary/10 rounded-sm">
                        {expand ? (<ChevronUp className="size-5 text-muted-foreground hover:text-primary" />) : (<ChevronDown className="size-5 hover:text-primary text-muted-foreground" />)}
                    </div>
                </div>
            </CardHeader>
            {
                expand && (
                    <>
                        <CardContent className="border-t border-border bg-card">
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 p-4 items-start">
                                <div className="space-y-4 py-4">
                                    <ServerCard />
                                    <ServerCard />
                                    <ServerCard />
                                </div>
                            </div>
                        </CardContent>
                    </>
                )
            }
        </Card >
    )
}