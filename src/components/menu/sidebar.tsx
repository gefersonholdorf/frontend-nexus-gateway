import {
    Camera,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { SidebarItem } from "./sidebar-item";
import { sidebarItems } from ".";

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

        bg-linear-to-br from-[#001B66] via-[#00185C] to-[#00144D]
        backdrop-blur
        text-white
        transition-all
        duration-300
        border-r
        border-zinc-800

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
                        border-zinc-800
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
                            />
                        ))}
                    </nav>
                </div>
                {!collapsed && (
                    <div className="flex justify-start p-4">
                        <span className="text-gray-300 text-[.8rem] font-normal">
                            © 2026 Geferson Holdorf
                        </span>
                    </div>
                )}
            </aside>
        </>
    );
}