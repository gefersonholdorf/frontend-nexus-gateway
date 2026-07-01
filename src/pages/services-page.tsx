import { HeaderPage } from "@/components/header-page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
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
    <>
      <HeaderPage
        title="Serviços"
        description="Visualize e acesse todos os serviços internos da infraestrutura."
        icon={MonitorCloud}
        actions={
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
        }
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Serviços</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex-1 px-8 py-4 space-y-4">
        <div className="relative flex items-center col-span-6">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-10 bg-(image:--background-gradient)"
            placeholder="Buscar serviço..."
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 py-4">
        <ServiceGrid fullDetails={fullDetails} filtering={filtering} />
      </div>
    </>
  )
}