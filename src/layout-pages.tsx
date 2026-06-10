import { cn } from "@/lib/utils";
import { useState } from "react";
import { Outlet } from "react-router";
import { MenuComponent } from "./components/menu/menu-horizontal";
import { Sidebar } from "./components/menu/sidebar";
import { useTheme } from "./contexts/theme-context";


export function LayoutPages() {
    const [collapsed, setCollapsed] = useState(false);
    const { theme } = useTheme()

    return (
        <div
            className={cn(
                "min-h-screen bg-cover bg-center bg-fixed bg-no-repeat",
                theme === "clean" && "bg-[url('/5570869.jpg')]",
                theme === "dark" && "bg-background"
            )}
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
        </div >
    );
}