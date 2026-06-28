import {
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from "lucide-react";

import { useState } from "react";

import { SidebarItem } from "./sidebar-item";
import { sidebarModules } from "./sidebar-module";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
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

                    ${collapsed ? "w-26" : "w-73"}
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* HEADER */}
                <div className="shrink-0 mt-20">
                    <div className="flex h-16 items-center justify-between border-b border-border px-4">
                        <div className="flex items-center pt-4 justify-center gap-2">
                            {/* <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center font-bold text-primary">
                                <img src="./logo-nexus.png" alt="" />
                            </div> */}

                            {!collapsed && (
                                <span className="font-semibold tracking-wide">
                                    Nexus Gateway
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="lg:hidden"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X size={20} />
                            </button>

                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="hidden lg:block justify-center items-center pt-3"
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
                {!collapsed && (
                    <div className="w-full items-center justify-center p-3">
                        <span className="text-[.75rem] text-muted-foreground">
                            © 2026 - Desenvolvido por Geferson
                        </span>
                    </div>
                )}
            </aside>
        </>
    );
}