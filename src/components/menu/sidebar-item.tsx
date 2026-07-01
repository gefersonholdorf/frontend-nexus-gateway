import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    collapsed: boolean;
    isBlocked?: boolean;
}

export function SidebarItem({
    icon: Icon,
    label,
    path,
    collapsed,
    isBlocked,
}: SidebarItemProps) {
    return (
        <NavLink
            to={isBlocked ? "#" : path}
            onClick={(e) => {
                if (isBlocked) e.preventDefault();
            }}
            className={({ isActive }) =>
                cn(
                    `flex items-center gap-3 rounded-lg px-3 py-3 transition-all`,
                    collapsed && "justify-center",
                    "hover:bg-primary/10 hover:text-primary",
                    isActive &&
                    "bg-primary/20 text-primary border-l-2 border-primary",
                    isBlocked &&
                    "hidden"
                )
            }
        >
            <Icon size={18} />

            {!collapsed && (
                <span className="text-[.9rem] truncate">
                    {label}
                </span>
            )}
        </NavLink>
    );
}