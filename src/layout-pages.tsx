import { Outlet } from "react-router";
import { FooterComponent } from "./components/footer";
import { MenuComponent } from "./components/menu";

export function LayoutPages() {
    return (
        <div className="bg-[url('/5570869.jpg')]
                bg-cover
                bg-center
                bg-fixed bg-no-repeat flex flex-col min-h-screen justify-between">
            <MenuComponent />
            <main className="flex-1">
                <Outlet />
            </main>
            <FooterComponent />
        </div>
    )
}