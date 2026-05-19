import { Expand, Minimize } from "lucide-react";
import { useState } from "react";
import { FooterComponent } from "./components/footer";
import { MenuComponent } from "./components/menu";
import { ServiceGrid } from "./components/service-grid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
        <div className="flex gap-3 items-center">
          <div className="flex justify-end">
            <img
              src="./logo-nexus.png"
              alt="Logo Nexus Gateway"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nexus Gateway</h1>
            <p className="text-zinc-500 text-sm">Acesso centralizado aos serviços e sistemas internos.</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger>
            {fullDetails ? (
              <Minimize onClick={toggleDetails} className="size-6 hover:text-blue-500 cursor-pointer" />
            ) : (
              <Expand onClick={toggleDetails} className="size-5 hover:text-blue-500 cursor-pointer" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {fullDetails ? (
              <p>Minimizar</p>
            ) : (
              <p>Expandir</p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1">
        <ServiceGrid fullDetails={fullDetails} filtering={filtering} />
      </div>
      <FooterComponent />
    </div>
  )
}