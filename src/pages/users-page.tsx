import { useFetchDocuments } from "@/api/documents/fetch-documents";
import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { type Filters } from "@/components/documents/filtering-documents";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatLastLogin } from "@/lib/format-last-login";
import { CheckCircle, Edit, FileText, MoreHorizontalIcon, Plus, Users, XCircle } from "lucide-react";
import { useState } from "react";

const users: User[] = [
    {
        id: 1,
        name: "Geferson Holdorf",
        email: "geferson@lusati.com.br",
        roleDescription: "Analista Suporte N2 | Devops",
        category: "Colaborador",
        status: "Inativo",
        lastLogin: "",
        updatedAt: "2026-06-27 19:36:32",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_geferson.PNG"
    },
    {
        id: 2,
        name: "Marcelo Verdi",
        email: "marcelo@lusati.com.br",
        roleDescription: "COO | CPO | Co-Founder",
        category: "Gestor",
        status: "Inativo",
        lastLogin: "",
        updatedAt: "2026-06-19 20:02:56",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_marcelo.PNG"
    },
    {
        id: 3,
        name: "Bruno Busarello",
        email: "bruno.busarello@lusati.com.br",
        roleDescription: "Analista Suporte N1",
        category: "Colaborador",
        status: "Ativo",
        lastLogin: "",
        updatedAt: "2026-06-20 13:12:42",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_bruno.PNG"
    },
    {
        id: 4,
        name: "Roberto Amorim",
        email: "roberto@lusati.com.br",
        roleDescription: "CEO | CTO | Founder",
        category: "Administrador",
        status: "Ativo",
        lastLogin: "2026-06-21 04:13:48",
        updatedAt: "2026-06-21 04:13:48",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_roberto.PNG"
    },
    {
        id: 5,
        name: "Leandro Santos",
        email: "leandro@lusati.com.br",
        roleDescription: "Desenvolvedor Pleno III",
        category: "Colaborador",
        status: "Ativo",
        lastLogin: "2026-06-21 04:13:48",
        updatedAt: "2026-06-21 21:21:18",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_leandro.PNG"
    },
    {
        id: 7,
        name: "Vitor Helker",
        email: "vitor@lusati.com.br",
        roleDescription: "Desenvolvedor Pleno II",
        category: "Colaborador",
        status: "Ativo",
        lastLogin: "",
        updatedAt: "2026-06-21 21:21:16",
        avatarUrl: "https://api2.lusati.com.br/repositorio/nexus/avatar_vitor.PNG"
    },
];

const columns: Column<User>[] = [
    {
        key: "id",
        title: "Id",
        render: (value) => (
            <div className="flex items-center gap-1 text-[.8rem]">
                <span>{value}</span>
            </div>
        )
    },
    {
        key: "name",
        title: "Usuário",
        render: (value, row) => (
            <div className="truncate max-w-70 flex gap-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage
                        src={row.avatarUrl ?? ""}
                    />
                    <AvatarFallback>
                        {row.name
                            .split(" ")
                            .slice(0, 2)
                            .map((v) => v[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <span>{value}</span>
                    <span className="text-[.8rem] text-muted-foreground">{row.roleDescription}</span>
                </div>
            </div>
        )
    },
    {
        key: "email",
        title: "E-mail",
        render: (value) => (
            <div className="text-muted-foreground text-[.9rem]">{value}</div>
        )
    },
    {
        key: "status",
        title: "Status",
        render: (value) => (
            <div className="flex items-center gap-1">
                {value === 'Ativo' && (
                    <>
                        <Badge className="bg-transparent text-emerald-500 border border-emerald-500">
                            <CheckCircle className="size-3 text-emerald-500" />
                            <span className="">Ativo</span>
                        </Badge>
                    </>
                )}
                {value === 'Inativo' && (
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
        key: "lastLogin",
        title: "Último Login",
        render: (value) => (
            <div>
                {value ? formatLastLogin(String(value)) : "---"}
            </div>
        )
    },
]

interface User {
    id: number
    name: string
    email: string
    avatarUrl: string
    roleDescription: string
    category: string
    status: string
    lastLogin: string
    updatedAt: string
}

export function UsersPage() {
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState<Filters>({
        text: "",
        category: "",
        status: "",
        department: "",
    });

    const { isLoading, data } = useFetchDocuments({
        page,
        perPage: 10,
        text: filters.text,
        category: filters.category,
        status: filters.status,
        department: filters.department,
    })

    const { isLoading: isLoadingSummary, data: dataSummary } = useFetchSummarys({
        page,
        perPage: 10,
        text: filters.text,
        category: filters.category,
        status: filters.status,
        department: filters.department,
    })

    //   const documents: Document[] = data ? data.documents : []

    function handleSetOpenCreateModal() {
        setOpenCreateModal(!openCreateModal)
    }

    function handleFiltering(newFilters: Filters) {
        console.log("NOVOS FILTROS", newFilters);
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
                title="Gerenciar Usuários"
                description="Gerencie os usuários da sua empresa."
                actions={
                    <Button
                        onClick={() => setOpenCreateModal(true)}
                    >
                        <Plus />
                        Adicionar Usuário
                    </Button>
                }
                icon={Users}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Usuários</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                {data && (
                    <TableComponent
                        data={users}
                        cardsQuantity={{
                            summarys: summarys ?? [],
                            isLoading: isLoadingSummary,
                        }}
                        columns={columns}
                        caption="Documentos ISO"
                        pagination={data.pagination}
                        onPageChange={setPage}
                        onFiltering={handleFiltering}
                        actions={(document) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                    >
                                        <MoreHorizontalIcon />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit />
                                        Editar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    />
                )}
            </div>
            {/* <CreateDocumentModal open={openCreateModal} onOpenChange={handleSetOpenCreateModal} /> */}
        </>
    )
}