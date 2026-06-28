import { useGetProfilesById } from "@/api/profiles/get-profile-by-id";
import { HeaderPage } from "@/components/header-page";
import { ProfileDeatilsComponent } from "@/components/profiles/profile-details-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Save, UserKey } from "lucide-react";
import { useParams } from "react-router";

interface Profile {
    id: number
    title: string,
    description: string | null,
    createdAt: string,
    status: boolean,
    countUsers: number,
    countTotalPermissions: number
    permissions:
    {
        id: number,
        key: string,
        description: string | null
    }[]
}

export function EditProfilePage() {
    const { id } = useParams<{ id: string }>();
    console.log(id)
    const { data, isLoading, isError } = useGetProfilesById({id: Number(id)})

    return (
        <>
            <HeaderPage
                title="Editar Perfil"
                description="Edite o perfil selecionado"
                icon={UserKey}
                actions={
                    <Button
                        // onClick={() => setOpenCreateModal(true)}
                    >
                        <Save />
                        Salvar Alterações
                    </Button>
                }
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/profiles">Perfis</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Editar Perfil</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <div className="w-full grid grid-cols-1 lg:grid-cols-3">
                    <ProfileDeatilsComponent profile={data?.profile} isError={isError} isLoading={isLoading} />
                </div>
            </div>
        </>
    )
}