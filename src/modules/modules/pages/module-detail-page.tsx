import { HeaderPage } from "@/components/header-page";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "date-fns";
import {
    Boxes,
    CalendarDays,
    CheckCircle,
    Hash,
    KeyRound,
    Plug,
    XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useHasPermission } from "@/modules/providers/permission-provider";
import { useToggleModuleActive } from "../hooks/use-toggle-module-active";
import { useFetchModules, type Module } from "../hooks/use-fetch-modules";
import { Can } from "@/modules/auth/components/can";

export function ModuleDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const moduleId = Number(id);

    const canManage = useHasPermission("modules.manage");
    const toggleModule = useToggleModuleActive();

    const { data, isLoading, isError } = useFetchModules();

    // Localiza o módulo pelo id da URL.
    const module: Module | undefined = useMemo(
        () => (data ?? []).find((m) => m.cd_id === moduleId),
        [data, moduleId],
    );

    return (
        <>
            <HeaderPage
                title={module?.ds_name ?? "Detalhes do módulo"}
                description="Visualize os dados do módulo e gerencie permissões e integrações vinculadas."
                icon={Boxes}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/modulos">Módulos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{module?.ds_name ?? "---"}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Card de dados do módulo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Boxes className="size-5 text-primary" />
                            Dados do módulo
                        </CardTitle>
                        <CardDescription>Informações gerais do módulo.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-4 w-96" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        ) : isError || !module ? (
                            <div className="flex flex-col items-start gap-3">
                                <span className="text-sm text-muted-foreground">
                                    {isError
                                        ? "Não foi possível carregar o módulo."
                                        : "Módulo não encontrado."}
                                </span>
                                <Button variant="outline" onClick={() => navigate("/modulos")}>
                                    Voltar para Módulos
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Nome</span>
                                    <span className="font-medium">{module.ds_name}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Chave</span>
                                    <span>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            <Hash className="mr-1 size-3" />
                                            {module.ds_key}
                                        </Badge>
                                    </span>
                                </div>

                                <div className="flex flex-col sm:col-span-2">
                                    <span className="text-xs text-muted-foreground">Descrição</span>
                                    <span>{module.ds_description ?? "---"}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Status</span>
                                    <div className="mt-1 flex items-center gap-2">
                                        {/* Switch protegido por permissão; sem permissão, só o Badge. */}
                                        {canManage && (
                                            <Switch
                                                checked={module.fl_active}
                                                onCheckedChange={() =>
                                                    toggleModule.mutate({
                                                        id: module.cd_id,
                                                        fl_active: !module.fl_active,
                                                    })
                                                }
                                                aria-label={
                                                    module.fl_active ? "Desativar módulo" : "Ativar módulo"
                                                }
                                            />
                                        )}

                                        {module.fl_active ? (
                                            <Badge className="border border-border bg-transparent text-primary-text/10">
                                                <CheckCircle className="size-4 text-emerald-500" />
                                                <span className="text-emerald-500">Ativo</span>
                                            </Badge>
                                        ) : (
                                            <Badge className="border border-border bg-transparent text-primary-text/10">
                                                <XCircle className="size-4 text-red-500" />
                                                <span className="text-red-500">Inativo</span>
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Criado em</span>
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="size-4 text-muted-foreground" />
                                        {module.dt_created_at
                                            ? formatDate(module.dt_created_at.toString(), "dd/MM/yyyy")
                                            : "---"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Seção: Permissões vinculadas (placeholder — depende de endpoint específico) */}
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <KeyRound className="size-5 text-primary" />
                                Permissões vinculadas
                            </CardTitle>
                            <CardDescription>
                                Permissões associadas a este módulo.
                            </CardDescription>
                        </div>

                        <Can permission="modules.manage">
                            <Button
                                variant="outline"
                                className="gap-2"
                                disabled={!module}
                                onClick={() => navigate(`/modulos/${moduleId}/permissoes`)}
                            >
                                <KeyRound className="size-4" />
                                Gerenciar
                            </Button>
                        </Can>
                    </CardHeader>

                    <CardContent>
                        {/* TODO: carregar vínculos via endpoint específico (não disponível na
                listagem de módulos). Placeholder abaixo evita inventar dados. */}
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                            <KeyRound className="size-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                O carregamento das permissões vinculadas depende de endpoint
                                específico. Use "Gerenciar" para administrar os vínculos.
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Seção: Integrações vinculadas (placeholder — depende de endpoint específico) */}
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Plug className="size-5 text-primary" />
                                Integrações vinculadas
                            </CardTitle>
                            <CardDescription>
                                Integrações associadas a este módulo.
                            </CardDescription>
                        </div>

                        <Can permission="modules.manage">
                            <Button
                                variant="outline"
                                className="gap-2"
                                disabled={!module}
                                onClick={() => navigate(`/modulos/${moduleId}/integracoes`)}
                            >
                                <Plug className="size-4" />
                                Gerenciar
                            </Button>
                        </Can>
                    </CardHeader>

                    <CardContent>
                        {/* TODO: carregar vínculos via endpoint específico (não disponível na
                listagem de módulos). Placeholder abaixo evita inventar dados. */}
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                            <Plug className="size-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                O carregamento das integrações vinculadas depende de endpoint
                                específico. Use "Gerenciar" para administrar os vínculos.
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}