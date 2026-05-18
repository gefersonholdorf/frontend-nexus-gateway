import { Expand } from "lucide-react";
import { useState } from "react";
import { FooterComponent } from "./components/footer";
import { MenuComponent } from "./components/menu";
import { ServiceGrid } from "./components/service-grid";

export function App() {
  const [fullDetails, setFullDetails] = useState(false)
  const [filtering, setFiltering] = useState("")

  function toggleDetails() {
    console.log("Toggle details")
    setFullDetails((prev) => !prev)
  }

  function handleFilterChange(value: string) {
    setFiltering(value)
  }

  return (
    <div className="bg-zinc-100 flex flex-col min-h-screen justify-between space-y-4">
      <MenuComponent onSetFiltering={handleFilterChange} />
      <div className="px-10 flex justify-between items-center border-b border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold">Nexus Gateway</h1>
          <p className="text-zinc-500 text-sm">Acesso centralizado aos serviços e sistemas internos.</p>
        </div>
        <Expand onClick={toggleDetails} className="size-6 hover:text-blue-500" />
      </div>
      <ServiceGrid fullDetails={fullDetails} filtering={filtering} />
      <FooterComponent />
    </div>
  )
}