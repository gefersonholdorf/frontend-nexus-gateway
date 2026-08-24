import { useFetchDocumentsUsersProfiles } from "@/api/documents/fetch-documents-users-profiles"
import { DocumentsModulesComponent } from "@/components/documents/modules"
import { DocumentsResponsiblesList } from "@/components/documents/modules/responsibles/responsibles-list"
import { ResponsibleProfilePanel } from "@/components/documents/modules/responsibles/responsible-profile-panel"
import { HeaderPage } from "@/components/header-page"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Users } from "lucide-react"
import { useMemo, useState } from "react"

export function DocumentsProfilePage() {
    const { data, isLoading, isError } = useFetchDocumentsUsersProfiles()
    const [selectedId, setSelectedId] = useState<string | number | undefined>()

    const responsibles = useMemo(() => {
        if (!data?.users) return []

        return data.users.map((user) => ({
            id: user.id,
            name: user.name,
            role: user.roleDescription,
            avatarUrl: user.avatarUrl,
            subtitle: user.lastLogin
                ? `Último acesso: ${new Date(user.lastLogin).toLocaleDateString("pt-BR")}`
                : undefined,
        }))
    }, [data])

    const selected = responsibles.find((r) => r.id === (selectedId ?? responsibles[0]?.id))

    return (
        <>
            <HeaderPage
                title="Perfil do responsável"
                description="Selecione um colaborador para visualizar responsabilidades e pendências"
                icon={Users}
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
                                <BreadcrumbPage>Responsabilidades</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="px-10 mb-6">
                <DocumentsModulesComponent />
            </div>
            <div className="flex-1 px-16 pb-8">
                {isError ? (
                    <div className="text-sm text-red-500 dark:text-red-400">
                        Erro ao carregar responsáveis. Tente novamente.
                    </div>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
                        <DocumentsResponsiblesList
                            responsibles={responsibles}
                            selectedId={selected?.id}
                            onSelect={setSelectedId}
                            isLoading={isLoading}
                        />
                        {selected ? (
                            <ResponsibleProfilePanel responsible={selected} />
                        ) : (
                            !isLoading && (
                                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-700">
                                    Selecione um colaborador ao lado para ver os detalhes.
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </>
    )
}