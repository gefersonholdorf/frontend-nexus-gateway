import { cn } from "@/lib/utils";
import { NavLink, Outlet } from "react-router";
import { MenuComponent } from "./components/menu/menu-horizontal";
import { Sidebar } from "./components/menu/sidebar";
import { useState } from "react";


export function LayoutPages() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className="
                bg-[url('/5570869.jpg')]
                bg-cover
                bg-center
                bg-fixed
                bg-no-repeat
                min-h-screen
            "
        >
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={cn(
                    "transition-all duration-300",
                    collapsed ? "lg:ml-20" : "lg:ml-72"
                )}
            >
                <MenuComponent />
                <main className="min-h-[calc(100vh-80px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}