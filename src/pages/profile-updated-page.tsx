import { useCreateProfile } from "@/api/profiles/create-profile";
import { useGetPermissions } from "@/api/profiles/get-permissions";
import { useGetProfilesById } from "@/api/profiles/get-profile-by-id";
import { useUpdateProfile } from "@/api/profiles/update-profile";
import { HeaderPage } from "@/components/header-page";
import { ProfileDetailsComponent } from "@/components/profiles/profile-details-component";
import { ProfileMatrizComponent } from "@/components/profiles/profile-matriz-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserKey } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

export const profileDetailsSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    status: z.boolean(),
    permissions: z.array(z.number())
})

export type ProfileDetailsSchema = z.infer<typeof profileDetailsSchema>


export function ProfilesUpdatedPage() {
    const { id } = useParams<{ id: string }>();

    const { data } = useGetProfilesById({ id: Number(id) })
    const { data: datPermissions, isLoading: isLoadingPermissions, isError: isErrorPermissions } = useGetPermissions()

    const form = useForm<ProfileDetailsSchema>({
        resolver: zodResolver(profileDetailsSchema),
        defaultValues: {
            title: "",
            description: "",
            status: true,
            permissions: [],
        },
    });

    const navigate = useNavigate()

    useEffect(() => {
        if (!data?.profile) return;

        form.reset({
            title: data.profile.title,
            description: data.profile.description,
            status: data.profile.status,
            permissions: data.profile.permissions.map(p => p.id),
        });
    }, [data, form]);

    const isCreating = !id

    const { mutateAsync: createProfile } = useCreateProfile();
    const { mutateAsync: updateProfile } = useUpdateProfile();

    const onSubmit = async (data: ProfileDetailsSchema) => {
        try {
            const permissions = data.permissions.map((permission) => {
                return {
                    id: permission
                }
            });

            if (isCreating) {
                await createProfile({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    permissions,
                });

                toast.success("Perfil criado com sucesso!", {
                    position: "top-center",
                    richColors: true,
                });

                form.reset();

                navigate('/profiles')
            } else {
                await updateProfile({
                    id: Number(id),
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    permissions,
                });

                toast.success("Perfil atualizado com sucesso!", {
                    position: "top-center",
                    richColors: true,
                });

                navigate('/profiles')
            }
        } catch (error) {
            console.error(error);

            toast.error(
                isCreating
                    ? "Erro ao criar perfil."
                    : "Erro ao atualizar perfil.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );

            navigate('/profiles')
        }
    };

    return (
        <>
            <HeaderPage
                title={isCreating ? "Criar Perfil" : "Editar Perfil"}
                description={isCreating ? "Criar novo Perfil" : "Edite o perfil selecionado"}
                icon={UserKey}
                actions={
                    <Button onClick={form.handleSubmit(onSubmit)}>
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
                                <BreadcrumbPage>{isCreating ? "Criar Perfil" : "Editar Perfil"}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <ProfileDetailsComponent
                            isCreating={isCreating}
                            profile={data?.profile}
                            form={form}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <ProfileMatrizComponent
                            form={form}
                            profile={data?.profile}
                            permissions={datPermissions?.permissions}
                            isError={isErrorPermissions}
                            isLoading={isLoadingPermissions}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}