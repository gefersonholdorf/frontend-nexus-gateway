import { CreateDocumentComponent } from "@/components/documents/form-document/create-document-component"
import { DocumentsModulesComponent } from "@/components/documents/modules"
import { HeaderPage } from "@/components/header-page"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Settings } from "lucide-react"

export function CreateDocumentPage() {
    return (
        <>
            <HeaderPage
                title="Cadastro de Documento"
                description="Preencha as informações gerais do documento."
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
                                <BreadcrumbPage>Novo Documento</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="px-10 mb-6">
                <DocumentsModulesComponent />
            </div>
            <div className="flex-1 px-16 pb-8">
                <CreateDocumentComponent />
            </div>
        </>
    )
}