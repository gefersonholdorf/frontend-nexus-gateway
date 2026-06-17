import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";


interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    collapsed: boolean;
    isBlocked?: boolean
}

export function SidebarItem({
    icon: Icon,
    label,
    path,
    collapsed,
    isBlocked
}: SidebarItemProps) {
    return (
        <NavLink
            to={isBlocked ? "#" : path}
            onClick={(e) => {
                if (isBlocked) {
                    e.preventDefault();
                }
            }}
            className={({ isActive }) =>
                cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
                    "hover:bg-primary/10 hover:text-primary text-menu font-semibold hover:font-semibold",
                    isActive &&
                    "bg-primary/20 text-primary shadow-md border-l-3 border-primary font-semibold",
                    isBlocked &&
                    "cursor-not-allowed opacity-50 border-none bg-transparent shadow-none text-muted-foreground"
                )
            }
        >
            <Icon size={18} className="" />

            {!collapsed && (
                <span className="truncate text-[.9rem]">
                    {label}
                </span>
            )}
        </NavLink>
    );
}