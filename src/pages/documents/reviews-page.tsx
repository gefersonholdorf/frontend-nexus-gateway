import { DocumentsModulesComponent } from "@/components/documents/modules"
import { ReviewComponent } from "@/components/documents/revisions/review-component"
import { HeaderPage } from "@/components/header-page"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Settings } from "lucide-react"

export function ReviewsDocumentPage() {
    return (
        <>
            <HeaderPage
                title="Getão de Revisões"
                description="Acompanhe todas as revisões de documentos."
                icon={Settings}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/documents">Documentos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Revisões</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="px-10 mb-6">
                <DocumentsModulesComponent />
            </div>
            <ReviewComponent />
        </>
    )
}