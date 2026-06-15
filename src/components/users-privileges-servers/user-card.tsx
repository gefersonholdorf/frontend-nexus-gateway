import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatLastLogin } from "@/lib/format-last-login";
import { ChevronDown, ChevronUp, Edit, History, TrendingUp, UserKey } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PrivilegesModal } from "./modals/privileges-modal";

interface UserCardProps {
    user: {
        username: string
        name: string
        logo: string
        servers: {
            server: string
            group: string
            status: string
            lastLogin: string | null
        }[]
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
                        <span className="text-[.8rem] text-muted-foreground">{user.username}</span>
                    </div>
                </div>
                <div className="flex gap-6 items-center">
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="group flex items-center gap-1">
                                <History className="text-muted-foreground size-5 group-hover:text-blue-500 cursor-pointer" />
                                <span className="text-[.9rem] text-muted-foreground group-hover:text-blue-500">Histórico</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>Ver Histórico</span>
                        </TooltipContent>
                    </Tooltip>
                    <PrivilegesModal user={user}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="group flex items-center gap-1">
                                    <UserKey className="text-muted-foreground size-4 cursor-pointer group-hover:text-blue-500" />
                                    <span className="text-[.9rem] text-muted-foreground group-hover:text-blue-500">Dar Privilégio</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Dar Privilégio</span>
                            </TooltipContent>
                        </Tooltip>
                    </PrivilegesModal>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="group flex items-center gap-1">
                                <Edit className="text-muted-foreground size-5 group-hover:text-blue-500 cursor-pointer" />
                                <span className="text-[.9rem] text-muted-foreground group-hover:text-blue-500">Editar</span>
                            </div>
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Servidor</TableHead>
                                            <TableHead>Ambiente</TableHead>
                                            <TableHead>Último Acesso</TableHead>
                                            <TableHead className="text-right">Privilégio</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {user.servers.map((server) => (
                                            <TableRow key={server.server}>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                                    ${server.status === "active"
                                                                ? "bg-green-500/10 text-green-500"
                                                                : "bg-red-500/10 text-red-500"
                                                            }`}
                                                    >
                                                        {server.status === 'active' ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    {server.server}
                                                </TableCell>

                                                <TableCell>
                                                    {server.server.includes("HOM")
                                                        ? "HOM"
                                                        : server.server.includes("APP")
                                                            ? "APP"
                                                            : server.server.includes("INFRA")
                                                                ? "INFRA"
                                                                : "-"}
                                                </TableCell>

                                                <TableCell>
                                                    {server.lastLogin ? formatLastLogin(server.lastLogin) : '---'}
                                                </TableCell>

                                                <TableCell className="text-right flex items-center justify-end gap-2">
                                                    <span className="font-medium text-primary-text flex items-center gap-1">
                                                        <TrendingUp className="size-4" />
                                                        {server.group.toUpperCase()}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </>
                )
            }
        </Card >
    )
}