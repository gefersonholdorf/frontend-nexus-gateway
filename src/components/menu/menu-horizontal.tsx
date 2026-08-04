import { useFetchNotifications } from "@/api/notifications/get-notifications-me";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-context";
import { useUser } from "@/contexts/user-context";
import { playNotificationSound } from "@/lib/notifications-dound";
import { websocket } from "@/services/websocket";
import { Bell, ChevronRight, ClipboardList, History, Info, LogOut, Moon, Sun, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AboutSystemModal } from "../modals/about-system-modal";
import { UpdatePasswordModal } from "../modals/change-user-modal";
import { EditUserModal } from "../modals/edit-user-modal";
import { Input } from "../ui/input";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatNotificationDate(date: string | Date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR,
    });
}

export function MenuComponent({ onSetFiltering }: { onSetFiltering?: (value: string) => void }) {
    const { user } = useUser();
    const navigate = useNavigate()
    const { theme, handleSetTheme } = useTheme();
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [aboutSystemModalOpen, setAboutSystemModalOpen] = useState(false);
    const { data: alerts, refetch } = useFetchNotifications();

    const isWelcomePage = window.location.pathname !== "/gateway"
    const app = import.meta.env.VITE_APP
    const version = import.meta.env.VITE_VERSION

    useEffect(() => {
        const unsubscribe = websocket.onMessage((message) => {
            switch (message.event) {
                case "notification.created":
                    playNotificationSound();
                    refetch();
                    break;
            }
        });
        return unsubscribe;
    }, [refetch]);

    const unreadCount = alerts ? alerts.notifications.length : 0;
    return (
        <>
            {app === 'homolog' && (
                <div className={`fixed flex items-center justify-center h-4 top-0 left-0 right-0 w-full z-50 bg-blue-500`}>
                    <span className="text-[.8rem] text-gray-100">Ambiente de Homologação - Versão {version}</span>
                </div>
            )}
            <div className={`fixed ${app === 'homolog' ? 'top-4' : 'top-0'} left-0 right-0 z-50 w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-between px-10 py-2 min-h-20 bg-(image:--background-gradient) items-center border-b border-border shadow-lg`}>
                <img src={`${theme === 'clean' ? 'https://api2.lusati.com.br/repositorio/nexus/logo-dark.png' : 'https://api2.lusati.com.br/repositorio/nexus/logo-light.png'}`} className="w-50 p-2 cursor-pointer" onClick={() => navigate('/welcome')} />
                <div>
                    {!isWelcomePage && (
                        <Input
                            placeholder="Pesquisar Serviços ou Sistema..."
                            className="w-full"
                            onChange={(e) => onSetFiltering && onSetFiltering(e.target.value)}
                        />
                    )}
                </div>
                <div className="flex gap-5 items-center w-fit justify-self-end px-2">
                    {/* <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-primary-text text-[.8rem]">Online</span>
                </div>
                <div className="px-2 border border-primary/20 bg-primary/10 text-primary rounded-sm">
                    <span className="text-[.8rem] font-medium">v1.4.0</span>
                </div> */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="relative flex items-center justify-center rounded-lg border border-transparent p-2 transition-colors hover:bg-card hover:border-border cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-card data-[state=open]:border-border"
                            >
                                <Bell className={`size-5 text-muted-foreground`} />

                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-amber-600 p-1 text-[.7rem] font-bold leading-none text-white shadow-md">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-95 p-0 overflow-hidden"
                        >
                            <div className="flex border-b p-4 gap-2">
                                <h3 className="font-semibold text-[.9rem] leading-none tracking-tight">
                                    Notificações
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {unreadCount} notificações
                                </p>
                            </div>

                            <div className="max-h-105 overflow-auto">

                                {alerts && alerts.notifications.map((alert) => (
                                    <DropdownMenuItem
                                        key={alert.id}
                                        className="items-start gap-3 py-4 cursor-pointer px-6 border-b"
                                    >
                                        <div className="mt-1">
                                            {alert.eventType === "glpi_new_problem" && (
                                                <ClipboardList className="text-blue-500 size-5" />
                                            )}
                                            {alert.eventType === "glpi_new_ticket" && (
                                                <Ticket className="text-purple-500 size-5" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {alert.title}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {alert.message}
                                            </p>

                                            <span className="text-[11px] text-muted-foreground">
                                                {formatNotificationDate(alert.createdAt)}
                                            </span>
                                        </div>

                                        {!alert.createdAt && (
                                            <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                                        )}
                                    </DropdownMenuItem>
                                ))}

                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* USER AREA */}
                    <div className="shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="hover:bg-card flex items-center gap-2 p-2 rounded-lg cursor-pointer">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`${user?.logo}`} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>

                                    <div className="flex w-full justify-between items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{user?.name}</span>
                                            <span className="text-[.7rem] text-muted-foreground">
                                                {user?.roleDescription}
                                            </span>
                                        </div>
                                        <ChevronRight />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-background text-primary-text">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>

                                    {/* <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setEditProfileOpen(true);
                                    }}
                                >
                                    <UserPen size={16} />
                                    Editar Perfil
                                </DropdownMenuItem> */}

                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setEditPasswordOpen(true);
                                        }}
                                    >
                                        <History size={16} />
                                        Alterar Senha
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            handleSetTheme(theme === 'clean' ? 'dark' : 'clean')
                                        }}
                                    >
                                        {theme === 'clean' ? (<Moon size={16} />) : <Sun size={16} />}
                                        Mudar Tema
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setAboutSystemModalOpen(true);
                                        }}
                                    >
                                        <Info size={16} />
                                        Sobre o Sistema
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => navigate("/")}>
                                        <LogOut className="text-red-500" size={16} />
                                        Sair do Sistema
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* MODALS */}
                <EditUserModal
                    open={editProfileOpen}
                    onOpenChange={setEditProfileOpen}
                    user={{
                        name: "Geferson Holdorf",
                        email: "geferson@lusati.com.br",
                        username: "gholdorf",
                        id: 1,
                    }}
                />

                <UpdatePasswordModal
                    userId={1}
                    open={editPasswordOpen}
                    onOpenChange={setEditPasswordOpen}
                />

                <AboutSystemModal
                    open={aboutSystemModalOpen}
                    onOpenChange={setAboutSystemModalOpen}
                />
            </div>
        </>
    )
}