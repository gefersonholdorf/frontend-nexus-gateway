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
                    "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
                    "hover:bg-background/10",
                    isActive &&
                    "bg-gray-200/10 text-primary-text shadow-md font-medium",
                    isBlocked &&
                    "cursor-not-allowed opacity-30"
                )
            }
        >
            <Icon size={18} className="text-primary-text" />

            {!collapsed && (
                <span className="truncate text-[.9rem] text-primary-text">
                    {label}
                </span>
            )}
        </NavLink>
    );
}