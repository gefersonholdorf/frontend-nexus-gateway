import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatLastLogin } from "@/lib/format-last-login";
import { ChevronDown, ChevronUp, Clock, Edit, History, Info, Monitor, Server, Shield, TrendingUp, UserKey } from "lucide-react";
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
            privilegeActive: boolean
            dt_expires_at: Date | null
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
                                            <TableHead><span className="flex items-center gap-1"><Info className="size-4" />Status</span></TableHead>
                                            <TableHead><span className="flex items-center gap-1"><Server className="size-4" />Servidor</span></TableHead>
                                            <TableHead><span className="flex items-center gap-1"><Monitor className="size-4" />Ambiente</span></TableHead>
                                            <TableHead className=""><span className="flex items-center gap-1"><Clock className="size-4" />Último Acesso</span></TableHead>
                                            <TableHead className="flex items-center justify-end"><span className="flex items-center gap-1"><Shield className="size-4" />Privilégio</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {user.servers.map((server) => (
                                            <TableRow key={server.server}>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 gap-1 text-xs font-medium
                                                    ${server.status === "active"
                                                                ? "bg-green-500/10 text-green-500"
                                                                : "bg-red-500/10 text-red-500"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-1 h-1 rounded-full ${server.status === 'active'
                                                                ? "bg-emerald-400"
                                                                : "bg-red-400"
                                                                }`}
                                                        />
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

                                                <TableCell className="text-right flex items-start justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <span className={`font-medium flex items-center gap-2 ${server.privilegeActive ? 'text-emerald-500' : 'text-primary-text'}`}>
                                                                {server.privilegeActive && (<TrendingUp className="size-4 text-emerald-500" />)}
                                                                {server.group.toUpperCase()}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="flex flex-col">
                                                                <span>Privilégio Concedido</span>
                                                                <span>{server.dt_expires_at ? 'Tem' : 'NOK'}</span>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
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