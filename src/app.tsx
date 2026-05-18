import { FooterComponent } from "./components/footer";
import { MenuComponent } from "./components/menu";
import { ServiceGrid } from "./components/service-grid";

export function App() {
  return (
    <div className="bg-zinc-100 flex flex-col min-h-screen justify-between">
      <MenuComponent />
      <ServiceGrid />
      <FooterComponent />
    </div>
  )
}