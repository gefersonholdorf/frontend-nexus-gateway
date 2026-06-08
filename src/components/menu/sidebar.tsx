import {
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { SidebarItem } from "./sidebar-item";
import { sidebarItems } from ".";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({
    collapsed,
    setCollapsed,
}: SidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

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
                    bg-zinc-900
                    p-2
                    text-white
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
                        bg-black/50
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

        bg-linear-to-br from-[#020B3F] via-[#030A35] to-[#010726]
        backdrop-blur
        text-white
        transition-all
        duration-300
        border-r
        border-gray-900

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
                        border-gray-800
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
                    <div className="hover:bg-gray-100/10 flex justify-start items-center gap-1 p-2 rounded-lg cursor-pointer">
                        <Avatar className="w-10">
                            <AvatarImage className="h-9 w-9" src="https://avatars.githubusercontent.com/u/68699314?v=4" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="text-sm">Perfil</span>
                                <span className="text-[.7rem] text-gray-200">Geferson - ADMIN</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <span className="text-gray-300 text-[.8rem] font-normal">
                            © 2026 Geferson Holdorf
                        </span>
                    )}
                </div>
            </aside>
        </>
    );
}