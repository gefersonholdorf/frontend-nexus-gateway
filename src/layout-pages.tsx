import { Outlet } from "react-router";
import { FooterComponent } from "./components/footer";
import { MenuComponent } from "./components/menu";

export function LayoutPages() {
    return (
        <div className="bg-zinc-100 flex flex-col min-h-screen justify-between space-y-4">
            <MenuComponent />
            <Outlet />
            <FooterComponent />
        </div>
    )
}