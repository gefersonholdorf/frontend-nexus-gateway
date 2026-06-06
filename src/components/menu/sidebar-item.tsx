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
                    "hover:bg-white/10",
                    isActive &&
                    "bg-blue-900 text-gray-300 shadow-md font-medium",
                    isBlocked &&
                    "cursor-not-allowed opacity-30"
                )
            }
        >
            <Icon size={18} />

            {!collapsed && (
                <span className="truncate text-[.9rem] text-gray-300">
                    {label}
                </span>
            )}
        </NavLink>
    );
}