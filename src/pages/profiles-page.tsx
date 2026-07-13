import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { useFetchProfiles } from "@/api/profiles/fetch-profiles";
import { FilteringDocuments, type Filters } from "@/components/documents/filtering-documents";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { CheckCircle, Code2, Edit, FileText, Headset, MoreHorizontalIcon, Plus, Server, ShieldCheck, UserCog, UserKey, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const columns: Column<Profile>[] = [
    {
        key: "id",
        title: "Id",
        render: (value) => (
            <div className="flex items-center gap-1 text-[.8rem]">
                <span>{value!.toString()}</span>
            </div>
        )
    },
    {
        key: "title",
        title: "Perfil",
        render: (value, row) => (
            <div className="truncate max-w-70 flex gap-2">
                <div className="flex rounded-full border border-border justify-center items-center w-10 h-10">
                    {value?.toString() === 'Desenvolvedor' && <Code2 className="size-5 text-purple-500" />}
                    {value?.toString() === 'Administrador' && <ShieldCheck className="size-5 text-amber-500" />}
                    {value?.toString() === 'Infraestrutura' && <Server className="size-5 text-blue-500" />}
                    {value?.toString() === 'Suporte' && <Headset className="size-5 text-emerald-500" />}
                    {!["Desenvolvedor", "Administrador", "Infraestrutura", "Suporte"].includes(value?.toString() ?? "") && (
                        <UserCog className="size-5 text-slate-500" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span>{value?.toString()}</span>
                    <span className="text-[.8rem] text-muted-foreground">{row.description}</span>
                </div>
            </div>
        )
    },
    {
        key: "countUsers",
        title: "Usuários",
        render: (value) => (
            <div className="truncate max-w-70 flex flex-col">
                <span>{value?.toString()}</span>
            </div>
        )
    },
    {
        key: "permissions",
        title: "Permissões",
        render: (value, row) => {
            if (!Array.isArray(value)) return null;

            return (
                <div className="flex flex-col gap-1">
                    <span>{value.length} / {row.countTotalPermissions}</span>
                    <span className="text-[.8rem] text-muted-foreground">{(value.length / row.countTotalPermissions) * 100}%</span>
                </div>
            );
        },
    },
    {
        key: "status",
        title: "Status",
        render: (value) => (
            <div className="flex items-center gap-1">
                {value && (
                    <>
                        <Badge className="bg-transparent text-emerald-500 border border-emerald-500">
                            <CheckCircle className="size-3 text-emerald-500" />
                            <span className="">Ativo</span>
                        </Badge>
                    </>
                )}
                {value === false && (
                    <>
                        <Badge className="bg-transparent text-red-500 border border-red-500">
                            <XCircle className="size-3" />
                            Inativo
                        </Badge>
                    </>
                )}
            </div>
        )
    },
    {
        key: "createdAt",
        title: "Criado em",
        render: (value) => (
            <div>
                {formatDate(value!.toString(), "dd/MM/yyyy - HH:mm")}
            </div>
        )
    },
]

export interface Profile {
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

export function ProfilePage() {
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [filters, setFilters] = useState<Filters>({
        text: "",
        category: "all",
        status: "all",
        profile: "all",
    });

    const { isLoading, data, isError, refetch } = useFetchProfiles({
        page,
        perPage: 10,
        title: filters.text,
        status: filters.status,
        profile: filters.profile,
    })

    const { isLoading: isLoadingSummary, data: dataSummary } = useFetchSummarys({
        page,
        perPage: 10,
        text: filters.text,
        category: filters.category,
        status: filters.status,
        profile: filters.profile,
    })

    function handleFiltering(newFilters: Filters) {
        setFilters(newFilters);
        setPage(1);
    }

    const summarys = dataSummary
        ? [
            {
                title: "Total",
                value: dataSummary.summary.total,
                icon: FileText,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
                title: "Vigentes",
                value: dataSummary.summary.present,
                icon: CheckCircle,
                colorText: "text-emerald-500",
                borderColor: "hover:border-emerald-500",
            },
            {
                title: "Em Revisão",
                value: dataSummary.summary.revision,
                icon: Edit,
                colorText: "text-amber-500",
                borderColor: "hover:border-amber-500",
            }
        ]
        : [];

    return (
        <>
            <HeaderPage
                title="Perfis"
                description="Gerencie os perfis da sua empresa."
                icon={UserKey}
                actions={
                    <Button
                        onClick={() => navigate('/profiles/create')}
                    >
                        <Plus />
                        Adicionar Perfil
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
                                <BreadcrumbPage>Perfis</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <TableComponent
                    data={data?.profiles ?? []}
                    cardsQuantity={{
                        summarys: summarys ?? [],
                        isLoading: isLoadingSummary,
                    }}
                    registerName="Perfis"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    filteringComponent={
                        <FilteringDocuments onFilterChange={handleFiltering} />
                    }
                    columns={columns}
                    pagination={
                        data?.pagination ?? {
                            page: 1,
                            perPage: 10,
                            total: 0,
                            totalPages: 1,
                            hasNextPage: false,
                            hasPreviousPage: false,
                        }
                    }
                    onPageChange={setPage}
                    actions={(profile) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8" >
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => navigate(`/profiles/${profile.id}`)}
                                >
                                    <Edit />
                                    Editar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>)} />
            </div>
        </>
    )
}