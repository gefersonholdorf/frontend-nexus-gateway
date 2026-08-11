import { useFetchTicketValidationPendings, type TicketValidationPending } from "@/api/glpi/get-tickets-validations-pending";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNowStrict, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp, CheckCircle, ChevronDown, ChevronUp, Circle, ClipboardList, Clock, ExternalLink, FileCheck, Minus, ShieldAlert, ShieldX, Ticket, Users, XCircle } from "lucide-react";

const columns: Column<TicketValidationPending>[] = [
    {
        key: "ticketTitle",
        title: "Solicitação",
        render: (value, row) => (
            <div className="flex items-center gap-2">
                {row.itilcategories_id === 23 && (
                    <div className="flex p-3 rounded-lg border border-border bg-card">
                        <ShieldX className="size-5 text-red-500" />
                    </div>
                )}
                {row.itilcategories_id === 19 && (
                    <div className="flex p-3 rounded-lg border border-border bg-card">
                        <ClipboardList className="size-5 text-purple-500" />
                    </div>
                )}
                {row.itilcategories_id === 21 && (
                    <div className="flex p-3 rounded-lg border border-border bg-card">
                        <Users className="size-5 text-red-500" />
                    </div>
                )}
                {row.itilcategories_id === 20 && (
                    <div className="flex p-3 rounded-lg border border-border bg-card">
                        <ShieldAlert className="size-5 text-amber-500" />
                    </div>
                )}
                {row.itilcategories_id === 17 && (
                    <div className="flex p-3 rounded-lg border border-border bg-card">
                        <Ticket className="size-5 text-blue-500" />
                    </div>
                )}
                {row.itilcategories_id === 2 && (
                    <div className="flex p-3 rounded-lg border border-border bg-card">
                        <Ticket className="size-5 text-blue-500" />
                    </div>
                )}
                <div className="flex flex-col gap-1">
                    <span className="font-medium">{value}</span>
                    <span className="text-[.8rem] text-muted-foreground border border-border rounded-lg px-2 py-1 w-fit">
                        {row.itilcategories_id === 23 && 'Incidente de Segurança da Informação'}
                        {row.itilcategories_id === 21 && 'Incidente de DP'}
                        {row.itilcategories_id === 20 && 'Evento de Segurança'}
                        {row.itilcategories_id === 19 && 'Solicitação'}
                        {row.itilcategories_id === 17 && 'Chamado'}
                        {row.itilcategories_id === 2 && 'Chamado - Cliente Externo'}
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: "requesterPathUrl",
        title: "Solicitante",
        render: (value, row) => {
            const name = row.requester ?? "";
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
                        <AvatarImage src={value ? String(value) : ""} />
                        <AvatarFallback className="bg-primary/90 text-white">
                            {initials || "?"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span>{row.requester ?? "---"}</span>
                        <span className="text-muted-foreground text-[.8rem]">
                            {row.userRole ?? "---"}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
  key: "priority",
  title: "Prioridade",
  render: (value) => {
    switch (value) {
      case "Muito Baixa":
        return (
          <Badge variant="outline" className="gap-1 border-slate-400 text-slate-500">
            <ArrowDown className="size-3" />
            Muito Baixa
          </Badge>
        );

      case "Baixa":
        return (
          <Badge variant="outline" className="gap-1 border-sky-500 text-sky-500">
            <ChevronDown className="size-3" />
            Baixa
          </Badge>
        );

      case "Média":
        return (
          <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600">
            <Minus className="size-3" />
            Média
          </Badge>
        );

      case "Alta":
        return (
          <Badge variant="outline" className="gap-1 border-border text-primary-text">
            <ChevronUp className="size-4 text-red-500" />
            Alta
          </Badge>
        );

      case "Muito Alta":
        return (
          <Badge variant="outline" className="gap-1 border-red-500 text-red-500">
            <ArrowUp className="size-3" />
            Muito Alta
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary">
            {value}
          </Badge>
        );
    }
  },
},
    {
        key: "createdAt",
        title: "Abertura",
        render: (value) => {
            if (!value) {
                return "-";
            }

            const date = new Date(value.toString().replace(" ", "T"));

            return (
                <div className="flex flex-col">
                    <span title={format(date, "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}>
                        {format(date, "dd/MM/yyyy HH:mm")}
                    </span>
                    <span className="text-muted-foreground text-[.8rem]">
                        {isPast(date)
                            && `Aberto há ${formatDistanceToNowStrict(date, {
                                locale: ptBR,
                            })}`}
                    </span>
                </div>
            );
        },
    },
    {
        key: "time_to_own",
        title: "SLA de Atendimento",
        render: (_, row) => {
            if (!row.time_to_own) {
                return (
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Circle className="size-3 fill-muted stroke-none" />
                        Sem SLA
                    </span>
                );
            }

            const start = new Date(row.createdAt.replace(" ", "T"));
            const end = new Date(row.time_to_own.replace(" ", "T"));
            const now = new Date();

            const total = end.getTime() - start.getTime();
            const remaining = end.getTime() - now.getTime();

            const percent = Math.max(
                0,
                Math.min(100, (remaining / total) * 100)
            );

            let color = "bg-emerald-500";

            if (percent <= 20) color = "bg-red-500";
            else if (percent <= 50) color = "bg-yellow-500";

            return (
                <div className="flex flex-col gap-1 w-40">
                    <div className="flex justify-between text-[.8rem]">
                        <span>{format(end, "dd/MM HH:mm")}</span>

                        <span className="font-medium">
                            {isPast(end)
                                ? `Expirado há ${formatDistanceToNowStrict(end, {
                                    locale: ptBR,
                                })}`
                                : formatDistanceToNowStrict(end, {
                                    locale: ptBR,
                                    addSuffix: true,
                                })}
                        </span>
                    </div>

                    <div className="h-3 rounded-full border border-border bg-card overflow-hidden">
                        <div
                            className={`h-full transition-all ${color}`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            );
        }
    },
    {
        key: "url",
        title: "Ações",
        render: (value) => (
            <TooltipProvider>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl border border-border text-primary-text hover:bg-card hover:border-muted-foreground cursor-pointer"
                                onClick={() => window.open(value!.toString(), "_blank")}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Revisar solicitação</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        ),
    }
];

export function TicketsValidationPendingsPage() {
    const { isLoading, data, isError, refetch } = useFetchTicketValidationPendings()

    const summarys = data?.summary
        ? [
            {
                title: "Pendentes para você",
                value: data.summary.pendingForMe,
                icon: FileCheck,
                colorText: "text-amber-500",
                borderColor: "hover:border-primary",
            },
            {
                title: "Aprovadas",
                value: data.summary.approveds,
                icon: CheckCircle,
                colorText: "text-emerald-500",
                borderColor: "hover:border-emerald-500",
            },
            {
                title: "Rejeitadas",
                value: data.summary.refusals,
                icon: XCircle,
                colorText: "text-red-500",
                borderColor: "hover:border-red-500",
            },
            {
                title: "Aguardando outros",
                value: data.summary.pendingForOthers,
                icon: FileCheck,
                colorText: "text-amber-500",
                borderColor: "hover:border-amber-500",
            },
            {
                title: "Taxa de Aprovação %",
                value: Number(data.summary.ratioApproveds.toFixed(2)),
                icon: Clock,
                colorText: "text-blue-500",
                borderColor: "hover:border-blue-500",
            },
        ]
        : [];

    return (
        <>
            <HeaderPage
                title="Central de Aprovações"
                description="Lista de chamados com validações pendentes."
                icon={Ticket}

                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Central de Aprovações</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <TableComponent
                    data={data?.ticketsValidationsPendings ?? []}
                    cardsQuantity={{
                        summarys: summarys ?? [],
                        isLoading: isLoading,
                    }}
                    registerName="Aprovações Pendentes"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    // filteringComponent={
                    //   <FilteringDocuments onFilterChange={handleFiltering} />
                    // }
                    columns={columns}
                //   pagination={
                //     data?.pagination ?? {
                //       page: 1,
                //       perPage: 10,
                //       total: 0,
                //       totalPages: 1,
                //       hasNextPage: false,
                //       hasPreviousPage: false,
                //     }
                //   }
                // onPageChange={setPage}
                //   actions={(document) => (
                //     <DropdownMenu>
                //       <DropdownMenuTrigger asChild>
                //         <Button variant="ghost" size="icon" className="size-8" >
                //           <MoreHorizontalIcon />
                //         </Button>
                //       </DropdownMenuTrigger>
                //       <DropdownMenuContent align="end" className="w-fit">
                //         <DropdownMenuItem onSelect={(e) => e.preventDefault()}> <Play /> Executar Backup
                //         </DropdownMenuItem>
                //       </DropdownMenuContent>
                //     </DropdownMenu>
                //   )}
                />
            </div>
        </>
    )
}