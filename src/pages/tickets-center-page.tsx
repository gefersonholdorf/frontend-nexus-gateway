import { useFetchTickets, type Ticket as TicketDetail } from "@/api/glpi/get-tickets";
import { useFetchTicketsSummary } from "@/api/glpi/get-tickets-summary";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { AlertsTicketsComponent } from "@/components/tickets/alerts-tickets-component";
import { FilteringStatusTicketsComponent } from "@/components/tickets/filtering-status-tickets";
import type { SLAResult } from "@/components/tickets/sla-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp, CheckCircle, ChevronDown, ChevronUp, Clipboard, FolderTree, Gauge, Link, Minus, MoreHorizontalIcon, OctagonAlert, Ticket, Timer, type LucideIcon } from "lucide-react";
import { useState } from "react";

interface Props {
    sla: SLAResult;
}
export function SLAComponent({ sla }: Props) {
    const colors: Record<SLAResult["color"], string> = {
        green: "text-green-600",
        yellow: "text-yellow-600",
        orange: "text-orange-600",
        red: "text-red-600",
    };

    const progressColors = {
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        orange: "bg-orange-500",
        red: "bg-red-500",
    };

    return (
        <div className="flex flex-col gap-1 min-w-36">

            <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">
                    {sla.title}
                </span>

                <span className="text-[11px] text-muted-foreground font-medium">
                    {sla.percentageValue}%
                </span>
            </div>

            <span className={`text-xs font-semibold ${colors[sla.color]}`}>
                {sla.label}
            </span>

            <Progress
                value={sla.percentage}
                className="h-2"
                indicatorClassName={progressColors[sla.color]}
            />
        </div>
    );
}

const statusConfig: Record<string, { className: string }> = {
    "Novo": { className: "bg-red-500/10 text-red-700 dark:text-red-400" },
    "Em atendimento": { className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    "Planejado": { className: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
    "Pendente": { className: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    "Solucionado": { className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    "Fechado": { className: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400" },
    "Aprovação": { className: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400" },
};
const priorityConfig: Record<
    string,
    { className: string; icon: LucideIcon }
> = {
    "Muito baixa": {
        className: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
        icon: ArrowDown,
    },
    "Baixa": {
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
        icon: ChevronDown,
    },
    "Média": {
        className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        icon: Minus,
    },
    "Alta": {
        className: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
        icon: ChevronUp,
    },
    "Muito alta": {
        className: "bg-red-500/10 text-red-700 dark:text-red-400",
        icon: ArrowUp,
    },
    "Major": {
        className: "bg-red-700/10 text-red-800 font-semibold dark:text-red-300",
        icon: OctagonAlert,
    },
};

const columns: Column<TicketDetail>[] = [
    {
        key: "name",
        title: "Título",
        render: (value, row) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="max-w-70 truncate flex flex-col gap-1 cursor-pointer"
                        onClick={() => window.open(`https://glpi.lusati.com.br/front/ticket.form.php?id=${row.id}`)}
                    >
                        <span className="truncate font-medium text-sm">
                            #{row.id} - {value?.toString()}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FolderTree className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                                {row.category}
                            </span>
                        </div>
                    </div>
                </TooltipTrigger>

                <TooltipContent>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">
                            #{row.id} - {value?.toString()}
                        </span>

                        <span className="text-muted-foreground text-xs">
                            {row.category}
                        </span>
                    </div>
                </TooltipContent>
            </Tooltip>
        ),
    },
    {
        key: "status",
        title: "Status",
        render: (value) => {
            const label = typeof value === "string" ? value : "---";
            const config = statusConfig[label];

            if (!config) return <span className="text-muted-foreground text-sm">---</span>;

            return (
                <div className={`inline-flex items-center gap-2 rounded-full px-2.5 h-6 text-[12px] font-medium tracking-tight border border-border ${config.className}`}>
                    <span className="size-2 rounded-full bg-current shrink-0" />
                    <span>{label}</span>
                </div>
            );
        },
    },
    {
        key: "priority",
        title: "Prioridade",
        render: (value) => {
            const label = typeof value === "string" ? value : "---";
            const config = priorityConfig[label];

            if (!config) {
                return <span className="text-muted-foreground text-sm">---</span>;
            }

            const Icon = config.icon;

            return (
                <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
                >
                    <Icon className="size-3.5" />
                    {label}
                </div>
            );
        },
    },
    {
        key: "requester",
        title: "Solicitante",
        render: (value) => {
            return (
                <div className="flex gap-2 items-center">
                    {value?.toString()}
                </div>
            );
        }
    },
    {
        key: "responsibles",
        title: "Responsável",
        render: (value) => {
            const list = Array.isArray(value) ? value : [];
            const first = list[0];
            const name = typeof first?.name === "string" ? first.name : "";

            const initials = name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map(part => part[0])
                .join("")
                .toUpperCase();

            return (
                <div className="flex gap-2 items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={first?.url ?? ""} />
                        <AvatarFallback className="bg-card text-white">
                            {initials || "?"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span>{name || "Nenhum Responsável"}</span>
                        <span className="text-muted-foreground text-[.8rem]">{list[0]?.role || "---"}</span>
                    </div>
                </div>
            );
        }
    },
    {
    key: "time_to_own",
    title: "SLA de Atendimento",
    render: (_, row) => {
        return (
            <div className="flex flex-col gap-1">
                <SLAComponent sla={row.sla.atendimento} />

                {row.time_to_own && (
                    <span className="text-[11px] text-muted-foreground">
                        Prazo:{" "}
                        {format(
                            new Date(row.time_to_own),
                            "dd/MM/yyyy HH:mm",
                            {
                                locale: ptBR
                            }
                        )}
                    </span>
                )}
            </div>
        );
    }
},
    {
    key: "time_to_resolve",
    title: "SLA de Resolução",
    render: (_, row) => {
        return (
            <div className="flex flex-col gap-1">
                <SLAComponent sla={row.sla.resolucao} />

                {row.time_to_resolve && (
                    <span className="text-[11px] text-muted-foreground">
                        Prazo:{" "}
                        {format(
                            new Date(row.time_to_resolve),
                            "dd/MM/yyyy HH:mm",
                            {
                                locale: ptBR
                            }
                        )}
                    </span>
                )}
            </div>
        );
    }
},
    {
        key: "date_mod",
        title: "Última Atualização",
        render: (value) => {
            if (!value) {
                return (
                    <div className="flex flex-col">
                        <span>---</span>
                        <span className="text-muted-foreground text-[.8rem]">---</span>
                    </div>
                );
            }

            const date = new Date(value.toString());
            const now = new Date();
            const totalMin = differenceInMinutes(now, date);
            const days = differenceInDays(now, date);
            let relative: string;

            if (totalMin < 1) {
                relative = "Agora";
            } else if (totalMin < 60) {
                relative = `${totalMin}min`;
            } else if (days < 1) {
                const hours = differenceInHours(now, date);
                const mins = totalMin % 60;
                relative = mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
            } else {
                relative = days === 1 ? "1 dia" : `${days} dias`;
            }
            const absolute = format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });

            return (
                <div className="flex flex-col">
                    <span>{relative}</span>
                    <span className="text-muted-foreground text-[.8rem]">
                        {absolute}
                    </span>
                </div>
            );
        }
    },
];

export function TicketsCenterPage() {
    const [status, setStatus] = useState(0);
    const [page, setPage] = useState(1)
    const { isLoading, data, isError, refetch } = useFetchTickets({
        status,
        page,
        limit: 50,
    })

    const { data: summaryData, isLoading: isLoadingSummary } = useFetchTicketsSummary();

    function handleSetStatus(status: number) {
        setPage(1)
        setStatus(status)
    }

    const ticketStatus = summaryData
        ? [
            {
                id: 0,
                name: "Todos",
                quantity: summaryData.summary.total,
            },
            {
                id: 1,
                name: "Aberto",
                quantity: summaryData.summary.new,
            },
            {
                id: 2,
                name: "Atendimento",
                quantity: summaryData.summary.inProgress,
            },
            {
                id: 10,
                name: "Aprovação",
                quantity: summaryData.summary.approval,
            },
            {
                id: 3,
                name: "Planejado",
                quantity: summaryData.summary.planned,
            },
            {
                id: 4,
                name: "Pendente",
                quantity: summaryData.summary.pending,
            },
            {
                id: 5,
                name: "Solucionado",
                quantity: summaryData.summary.solved,
            },
            {
                id: 6,
                name: "Fechado",
                quantity: summaryData.summary.closed,
            },
        ]
        : [];

    const summarys = summaryData
        ? [
            {
                title: "Abertos",
                value: summaryData.summary.new,
                icon: Clipboard,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
                title: "SLA Geral %",
                value: Number(((summaryData.summary.sla.atendimento.percentage + summaryData.summary.sla.resolucao.percentage) / 2).toFixed(1)),
                icon: Gauge,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
            title: "SLA Atendimento",
            value: Number(summaryData.summary.sla.atendimento.percentage.toFixed(1)),
            icon: Timer,
            colorText:
                summaryData.summary.sla.atendimento.percentage >= 90
                    ? "text-emerald-500"
                    : "text-red-500",
            borderColor:
                summaryData.summary.sla.atendimento.percentage >= 90
                    ? "hover:border-emerald-500"
                    : "hover:border-red-500",
        },

        {
            title: "SLA Resolução",
            value: Number(summaryData.summary.sla.resolucao.percentage.toFixed(1)),
            icon: CheckCircle,
            colorText:
                summaryData.summary.sla.resolucao.percentage >= 90
                    ? "text-emerald-500"
                    : "text-red-500",

            borderColor:
                summaryData.summary.sla.resolucao.percentage >= 90
                    ? "hover:border-emerald-500"
                    : "hover:border-red-500",
        },
        ]
        : [];


    return (
        <>
            <HeaderPage
                title="Central de Chamados"
                description="Gerencie chamados e solicitações em um único lugar, com acesso rápido ao GLPI."
                icon={Ticket}

                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/operations">Central de Operações</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Central de Chamados</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <AlertsTicketsComponent />
                <TableComponent
                    data={data?.tickets ?? []}
                    cardsQuantity={{
                        summarys: summarys ?? [],
                        isLoading: isLoadingSummary,
                    }}
                    registerName="Chamados"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    filteringComponent={
                        <FilteringStatusTicketsComponent ticketStatus={ticketStatus} status={status} onSetStatus={handleSetStatus} />
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
                    actions={(ticket) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8" >
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-fit">
                                <DropdownMenuItem onSelect={() => window.open(`https://glpi.lusati.com.br/front/ticket.form.php?id=${ticket.id}`)}> <Link /> Abrir Chamado
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>
        </>
    )
}