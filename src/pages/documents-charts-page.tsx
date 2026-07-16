import { useFetchDocumentsMetrics } from "@/api/documents/documents-metrics";
import { CardChart } from "@/components/documents/charts/card-chart";
import { ConsultationRankingChart } from "@/components/documents/charts/consultation-ranking";
import { DocumentsByCategoryChart } from "@/components/documents/charts/documents-by-category";
import { DocumentsByRolesChart } from "@/components/documents/charts/documents-by-roles";
import { DocumentsByStatusChart } from "@/components/documents/charts/documents-by-status";
import { EvolutionOfAccessChart } from "@/components/documents/charts/evolution-of-access";
import { Indicator } from "@/components/documents/charts/indicators";
import { Period } from "@/components/documents/charts/period";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "date-fns";
import { Eye, FileText } from "lucide-react";
import { useState } from "react";

const columns: Column<DocumentsAccess>[] = [
  {
    key: "code",
    title: "Código",
    render: (value) => (
      <div className="flex items-center gap-1 text-[.8rem]">
        <span>{value?.toString()}</span>
      </div>
    )
  },
  {
    key: "title",
    title: "Documento",
    render: (value) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate max-w-70">
            <span>{value?.toString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {value?.toString()}
          </span>
        </TooltipContent>
      </Tooltip>
    )
  },
  {
    key: "access",
    title: "Acessos",
    render: (value) => (
      <div className="flex gap-2 items-center">
        <Eye className="size-4" />
        {value?.toString()}
      </div>
    )
  },
  {
    key: "lastAccess",
    title: "Último acesso em",
    render: (value) => (
      <div>
        {value ? formatDate(value?.toString(), "dd/MM/yyyy - HH:mm") : '---'}
      </div>
    )
  },
]

export interface DocumentsAccess {
  id: number
  code: string
  title: string
  access: number
  lastAccess: string | null
}[]

export function DocumentsChartsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "1y" | "ds">("7d")
  const { data, isError, isLoading, refetch } = useFetchDocumentsMetrics({ period })
  return (
    <>
      <HeaderPage
        title="Painel de Indicadores - Documentos ISO"
        description="Central de documentos, políticas, procedimentos."
        icon={FileText}
        actions={
          <div className="w-full flex justify-end">
            <Period period={period} onSetPeriod={setPeriod} />
          </div>
        }
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/documents">Documentos ISO</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Painel de Indicadores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-16 py-8">
        <div className="col-span-2 space-y-6">
          <Indicator />
        </div>
        <DocumentsByStatusChart documentsByStatus={data?.metrics.documentsByStatus ?? []} />
        <DocumentsByCategoryChart documentsByCategory={data?.metrics.documentsByCategory ?? []} />
        <div className="col-span-2 grid grid-cols-3 gap-6">
          <div className="col-span-2 w-full">
            <CardChart title="Documentos mais acessados" description="Documentos mais acessados durante este período">
              <TableComponent
                data={data?.metrics.documentAccessTable ?? []}
                registerName="Documentos"
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
                columns={columns}
              />
            </CardChart>
          </div>
          <div className="col-span-1">
            <DocumentsByRolesChart documentsByRolesPercentual={data?.metrics.documentsByRolesPercentual ?? []} />
          </div>
        </div>
        <EvolutionOfAccessChart evolutionAccess={data?.metrics.evolutionAccess ?? []} />
        <ConsultationRankingChart usersRanking={data?.metrics.usersRanking ?? []} />
      </div>
    </>
  )
}