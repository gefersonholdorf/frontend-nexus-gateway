import { useGetReviewById } from "@/api/documents/reviews/get-review-by-id"
import { DocumentsModulesComponent } from "@/components/documents/modules"
import { ReviewDetailsComponent } from "@/components/documents/revisions/review-details-component"
import { HeaderPage } from "@/components/header-page"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Settings } from "lucide-react"
import { useParams } from "react-router"

export function ReviewDetailsDocumentPage() {
    const { id } = useParams<{ id: string }>();

    const { isLoading, data, isError } = useGetReviewById({
        revisionId: Number(id)
    })

    return (
        <>
            <HeaderPage
                title={`Revisão #${id}`}
                description="Detalhes e versões do documento."
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
                                <BreadcrumbLink href="/reviews">Revisões</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Revisão #{id}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="px-10 mb-6">
                <DocumentsModulesComponent />
            </div>
            <ReviewDetailsComponent
                review={data?.revision}
                isError={isError}
                isLoading={isLoading}
            />
        </>
    )
}