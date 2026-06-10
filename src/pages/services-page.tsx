import { BackComponent } from "@/components/back-component";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Expand, Minimize, MonitorCloud, Search } from "lucide-react";
import { useState } from "react";
import { ServiceGrid } from "../components/service-grid";

export function ServicesPage() {
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
    <div className="bg-background bg-cover bg-center flex flex-col min-h-screen justify-between">
      <div className="px-10 flex justify-between items-center border-b border-border bg-background p-4 rounded-lg">
        <div className="flex gap-3 items-center">
          <BackComponent />
          <div className="w-10 h-10 border border-border rounded-md overflow-hidden flex items-center justify-center bg-background">
            <MonitorCloud className="text-primary size-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Serviços</h1>
            <p className="text-primary-text text-[.8rem]">Visualize e acesse todos os serviços internos da infraestrutura.</p>
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
      <div className="bg-background px-10 py-4 grid grid-cols-1 lg:grid-cols-9 gap-2">
        <div className="relative flex items-center col-span-6">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-10"
            placeholder="Buscar serviço..."
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 py-4">
        <ServiceGrid fullDetails={fullDetails} filtering={filtering} />
      </div>
    </div>
  )
}