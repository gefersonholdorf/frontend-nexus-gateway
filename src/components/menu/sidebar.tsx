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

import { EditUserModal } from "../modals/edit-user-modal";
import { UpdatePasswordModal } from "../modals/change-user-modal";
import { sidebarModules } from "./sidebar-module";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);

    return (
        <>
            {/* BOTÃO MOBILE */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-4 z-50 rounded-lg bg-background p-2 text-primary-text lg:hidden"
            >
                <Menu size={22} />
            </button>

            {/* OVERLAY MOBILE */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen flex flex-col
                    bg-(image:--background-gradient)
                    backdrop-blur text-primary-text
                    border-r shadow-lg border-border
                    transition-all duration-300

                    ${collapsed ? "w-23" : "w-73"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* HEADER */}
                <div className="shrink-0">
                    <div className="flex h-16 items-center justify-between border-b border-border px-4">
                        <div className="flex items-center gap-2">
                            {/* <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center font-bold text-primary">
                                <img src="./logo-nexus.png" alt="" />
                            </div> */}

                            {!collapsed && (
                                <span className="font-semibold tracking-wide">
                                    Nexus Gateway
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="lg:hidden"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X size={20} />
                            </button>

                            <button
                                onClick={() => setCollapsed(!collapsed)}
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
                </div>

                {/* MENU (SCROLL REAL FUNCIONANDO) */}
                <div className="flex-1 min-h-0 overflow-y-auto px-2 sidebar-scroll">
                    <nav className="p-4 space-y-5">
                        {sidebarModules.map((module, index) => (
                            <div key={index}>
                                {!collapsed && (
                                    <h4 className="mb-2 px-3 text-[.65rem] uppercase tracking-widest text-muted-foreground">
                                        {module.title}
                                    </h4>
                                )}

                                <div className="space-y-1">
                                    {module.items.map((item, i) => (
                                        <SidebarItem
                                            key={i}
                                            icon={item.icon}
                                            label={item.label}
                                            path={item.path}
                                            collapsed={collapsed}
                                            isBlocked={item.isBlocked}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* USER AREA */}
                <div className="shrink-0 border-t border-border p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="hover:bg-card flex items-center gap-2 p-2 rounded-lg cursor-pointer">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://avatars.githubusercontent.com/u/68699314?v=4" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                {!collapsed && (
                                    <div className="flex w-full justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{user?.name}</span>
                                            <span className="text-[.7rem] text-muted-foreground">
                                                Admin
                                            </span>
                                        </div>
                                        <ChevronRight />
                                    </div>
                                )}
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-background text-primary-text">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>

                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setEditProfileOpen(true);
                                    }}
                                >
                                    <UserPen size={16} />
                                    Editar Perfil
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setEditPasswordOpen(true);
                                    }}
                                >
                                    <History size={16} />
                                    Alterar Senha
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => navigate("/")}>
                                    <LogOut className="text-red-500" size={16} />
                                    Sair do Sistema
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {!collapsed && (
                        <span className="text-[.75rem] text-muted-foreground">
                            © 2026 - Desenvolvido por Geferson
                        </span>
                    )}
                </div>
            </aside>

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
        </>
    );
}