import { ConsultationRankingChart } from "@/components/documents/charts/consultation-ranking";
import { DocumentsByCategoryChart } from "@/components/documents/charts/documents-by-category";
import { DocumentsByStatusChart } from "@/components/documents/charts/documents-by-status";
import { EvolutionOfAccessChart } from "@/components/documents/charts/evolution-of-access";
import { Indicator } from "@/components/documents/charts/indicators";
import { Period } from "@/components/documents/charts/period";
import { HeaderPage } from "@/components/header-page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileText } from "lucide-react";

export function DocumentsChartsPage() {

  return (
    <>
      <HeaderPage
        title="Painel de Indicadores - Documentos ISO"
        description="Central de documentos, políticas, procedimentos."
        icon={FileText}
        actions={
          <div className="w-full flex justify-end">
            <Period />
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
        <EvolutionOfAccessChart />
        <ConsultationRankingChart />
        <DocumentsByStatusChart />
        <DocumentsByCategoryChart />
      </div>
    </>
  )
}