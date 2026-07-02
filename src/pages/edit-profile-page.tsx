import { useGetPermissions } from "@/api/profiles/get-permissions";
import { useGetProfilesById } from "@/api/profiles/get-profile-by-id";
import { HeaderPage } from "@/components/header-page";
import { ProfileDeatilsComponent } from "@/components/profiles/profile-details-component";
import { ProfileMatrizComponent } from "@/components/profiles/profile-matriz-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Save, UserKey } from "lucide-react";
import { useParams } from "react-router";

export function EditProfilePage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, isError } = useGetProfilesById({id: Number(id)})
    const { data: datPermissions, isLoading: isLoadingPermissions, isError: isErrorPermissions} = useGetPermissions()

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
                <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <ProfileDeatilsComponent profile={data?.profile} isError={isError} isLoading={isLoading} />
                    </div>
                    <div className="lg:col-span-2">
                        <ProfileMatrizComponent profile={data?.profile} permissions={datPermissions?.permissions} isError={isErrorPermissions} isLoading={isLoadingPermissions} />
                    </div>
                </div>

            </div>
        </>
    )
}