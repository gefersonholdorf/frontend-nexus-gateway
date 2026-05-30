import { Outlet } from "react-router";
import { FooterComponent } from "./components/footer";
import { MenuComponent } from "./components/menu";

export function LayoutPages() {
    return (
        <div className="bg-zinc-100 flex flex-col min-h-screen justify-between">
            <MenuComponent />
            <Outlet />
            <FooterComponent />
        </div>
    )
}