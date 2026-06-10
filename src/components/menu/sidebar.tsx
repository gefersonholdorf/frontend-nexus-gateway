import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import {
    ChevronLeft,
    ChevronRight,
    History,
    LogOut,
    Menu,
    UserPen,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { sidebarItems } from ".";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({
    collapsed,
    setCollapsed,
}: SidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { userName } = useUser()
    const navigate = useNavigate()

    return (
        <>
            {/* Botão Mobile */}
            <button
                onClick={() => setMobileOpen(true)}
                className="
                    fixed
                    left-4
                    top-4
                    z-50
                    rounded-lg
                    bg-background
                    p-2
                    text-primary-text
                    lg:hidden
                "
            >
                <Menu size={22} />
            </button>

            {/* Overlay Mobile */}
            {mobileOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-background/50
                        lg:hidden
                    "
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`
        fixed
        top-0
        left-0
        z-50
        h-screen

        flex
        flex-col

        bg-(image:--background-gradient)
        backdrop-blur
        text-primary-text
        transition-all
        duration-300
        border-r
        border-border

        justify-between

        ${collapsed ? "w-20" : "w-72"}

        ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
    `}
            >
                <div>
                    {/* Header */}
                    <div
                        className="
                        flex
                        h-16
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-4
                    "
                    >
                        {!collapsed && (
                            <h2 className="font-bold text-lg">
                                Nexus Gateway
                            </h2>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                className="lg:hidden"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X size={20} />
                            </button>

                            <button
                                onClick={() =>
                                    setCollapsed(!collapsed)
                                }
                                className="hidden lg:block"
                            >
                                {collapsed ? (
                                    <ChevronRight size={20} />
                                ) : (
                                    <ChevronLeft size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navegação */}
                    <nav className="space-y-2 p-4">
                        {sidebarItems.map((item, index) => (
                            <SidebarItem
                                key={index}
                                icon={item!.icon}
                                label={item!.label}
                                path={item!.path}
                                collapsed={collapsed}
                                isBlocked={item?.isBlocked}
                            />
                        ))}
                    </nav>
                </div>
                <div className="flex flex-col gap-4 justify-start p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="hover:bg-gray-100/10 flex justify-start items-center gap-1 p-2 rounded-lg cursor-pointer">
                                <Avatar className="w-10">
                                    <AvatarImage className="h-9 w-9" src="https://avatars.githubusercontent.com/u/68699314?v=4" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                {!collapsed && (
                                    <div className="w-full flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{userName}</span>
                                            <span className="text-[.7rem] text-primary-text/20">Admin</span>
                                        </div>
                                        <div>
                                            <ChevronRight />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-blue-900/50 text-primary-text">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem><UserPen />Editar Perfil</DropdownMenuItem>
                                <DropdownMenuItem><History />Alterar Senha</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/')}>
                                    <LogOut className="text-red-500" /> Sair do Sistema
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {!collapsed && (
                        <span className="text-primary-text text-[.8rem] font-normal">
                            © 2026 Geferson Holdorf
                        </span>
                    )}
                </div >
            </aside >
        </>
    );
}