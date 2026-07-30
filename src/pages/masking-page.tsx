import { useFetchMaskings, type Masking } from "@/api/maskings/fetch-maskings";
import { useFetchSummarysMaskings } from "@/api/maskings/fetch-summary";
import { HeaderPage } from "@/components/header-page";
import { DrawerMasking } from "@/components/maskings/drawer-masking";
import { TableComponent, type Column } from "@/components/table-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, CheckCircle, Database, Download, Eye, EyeOff, MoreHorizontalIcon, TriangleAlert, XCircle } from "lucide-react";
import { useState } from "react";

const columns: Column<Masking>[] = [
    {
        key: "executionId",
        title: "Execução",
        render: (value) => (
            <span className="flex items-center gap-2">
                {value}
            </span>
        )
    },
    {
        key: "dsEnvironment",
        title: "Ambiente",
        render: (value) => (
            <span className="flex items-center gap-2">
                {value}
            </span>
        )
    },
    {
        key: "status",
        title: "Status",
        render: (value) => {
            const status = value;

            const config = {
                SUCCESS: {
                    label: "Sucesso",
                    className: "text-green-500",
                    icon: CheckCircle,
                },
                PARTIAL_ERROR: {
                    label: "Parcial",
                    className: "text-yellow-500",
                    icon: AlertTriangle,
                },
                ERROR: {
                    label: "Erro",
                    className: "text-red-500",
                    icon: XCircle,
                },
            }[status];

            const Icon = config!.icon;

            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium `}
                >
                    <Icon className={`h-3.5 w-3.5 ${config!.className}`} />
                    <span className="text-primary-text text-[.8rem]">{config!.label}</span>
                </span>
            );
        },
    },
    {
        key: "databasesExpected",
        title: "Databases",
        render: (value, row) => {
            const success = row.databasesSuccess;
            const expected = value as number;
            const percentage =
                expected > 0 ? Math.round((success / expected) * 100) : 0;

            return (
                <div className="flex items-center gap-3 w-30">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${percentage === 100
                                ? "bg-emerald-500"
                                : percentage >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <span className="text-sm font-medium whitespace-nowrap">
                        {success}/{expected}
                    </span>
                </div>
            );
        }
    },
    {
        key: "recordsProcessed",
        title: "Registros Afetados",
        render: (value) => {
            return (
                <span className="flex items-center gap-2">
                    {value.toLocaleString("pt-BR")}
                </span>
            );
        }
    },
    {
        key: "finishedAt",
        title: "Duração",
        render: (value, row) => {
            const start = new Date(row.startedAt).getTime();
            const end = new Date(value).getTime();

            const diff = Math.max(0, end - start);

            const minutes = Math.floor(diff / 1000 / 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return (
                <span className="flex items-center gap-2">
                    {minutes > 0 ? `${minutes}m ` : ""}
                    {seconds}s
                </span>
            );
        }
    },
    {
        key: "startedAt",
        title: "Início",
        render: (value) => (
            <span className="flex items-center gap-2">
                {format(new Date(value), "dd/MM/yyyy HH:mm:ss", {
                    locale: ptBR,
                })}
            </span>
        )
    },
]

export function MaskingPage() {
    const [page, setPage] = useState(1)
    const [openFlow, setOpenFlow] = useState(false)
    const [masking, setMasking] = useState<Masking | null>(null)

    function handleSetOpenFlow(masking: Masking | null) {
        setOpenFlow(!openFlow)
        setMasking(masking)
    }

    const { isLoading, data, isError, refetch } = useFetchMaskings({
        page,
        perPage: 10,
    })

    const { isLoading: isLoadingSummary, data: dataSummary } = useFetchSummarysMaskings({
        page,
        perPage: 10,
    })

    const summarys = dataSummary
        ? [
            {
                title: "Total",
                value: dataSummary.summary.total,
                icon: Database,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
                title: "Sucessos",
                value: dataSummary.summary.success,
                icon: CheckCircle,
                colorText: "text-emerald-500",
                borderColor: "hover:border-emerald-500",
            },
            {
                title: "Erros",
                value: dataSummary.summary.error,
                icon: XCircle,
                colorText: "text-red-500",
                borderColor: "hover:border-red-500",
            },
            {
                title: "Erros em Parte",
                value: dataSummary.summary.partialError,
                icon: TriangleAlert,
                colorText: "text-orange-500",
                borderColor: "hover:border-orange-500",
            },
        ]
        : [];

    return (
        <>
            <HeaderPage
                title="Mascaramento de Dados"
                description="Central de gerenciamento, monitoramento e acompanhamento das execuções de mascaramento de dados."
                icon={EyeOff}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Mascaramento</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <TableComponent
                    data={data?.maskings ?? []}
                    cardsQuantity={{
                        summarys: summarys ?? [],
                        isLoading: isLoadingSummary,
                    }}
                    registerName="Registros"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    // filteringComponent={
                    //   <FilteringDocuments onFilterChange={handleFiltering} />
                    // }
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
                    actions={(masking) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8" >
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-fit">
                                <DropdownMenuItem onClick={() => handleSetOpenFlow(masking)}> <Eye /> Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={async () => {
                                        const response = await fetch(
                                            `https://api2.lusati.com.br/repositorio/nexus/diamante-mask-db/${masking.path}`
                                        )

                                        const blob = await response.blob()
                                        const url = URL.createObjectURL(blob)

                                        const a = document.createElement("a")
                                        a.href = url
                                        a.download = masking.path.split("/").pop() ?? "log.json"

                                        document.body.appendChild(a)
                                        a.click()
                                        a.remove()

                                        URL.revokeObjectURL(url)
                                    }}
                                >
                                    <Download />
                                    Download do Log
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
                <DrawerMasking open={openFlow} onOpenChange={handleSetOpenFlow} masking={masking} />
            </div>
        </>
    )
}