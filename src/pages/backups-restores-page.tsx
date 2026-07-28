import { useFetchBackups } from "@/api/backups/fetch-backups";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { differenceInSeconds, format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DatabaseBackup, MoreHorizontalIcon, Play, Server } from "lucide-react";

interface Backup {
  id: number
  backupAutomationIdNas: number
  system: string
  description: string
  path: string
  retentionDays: number
  backupsDays: number
  enabled: boolean
  nextTriggerTime: string | null
  createdAt: string
  updatedAt: string
}

const columns: Column<Backup>[] = [
  {
    key: "system",
    title: "Sistema",
    render: (value) => (
      <span className="flex items-center gap-2">
        Diamante ({value?.toString()})
      </span>
    )
  },
  {
    key: "system",
    title: "Ambiente",
    render: (value) => (
      <span className="flex items-center gap-2">
        Produção
      </span>
    )
  },
  {
    key: "nextTriggerTime",
    title: "Último Backup",
    render: (value) => {
      if (!value || typeof value === "boolean") {
        return <span>---</span>;
      }
      const date = new Date(value.toString().replace(" ", "T"));

      const seconds = differenceInSeconds(date, new Date());

      if (seconds > 0) {
        return (
          <span title={format(date, "dd/MM/yyyy HH:mm")}>
            {formatDistanceToNow(date, {
              locale: ptBR,
              addSuffix: true,
            }).replace("em cerca de", "em")}
          </span>
        );
      }

      return (
        <span title={format(date, "dd/MM/yyyy HH:mm")}>
          atrasado{" "}
          {formatDistanceToNow(date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
      );
    },
  },
  {
    key: "backupsDays",
    title: "Tamanho",
    render: (value) => (
      <span>
        25GB
      </span>
    )
  },
  {
    key: "backupsDays",
    title: "Status",
    render: (value) => (
      <span>
        Sucesso
      </span>
    )
  },
  {
    key: "nextTriggerTime",
    title: "Próximo Backup",
    render: (value) => {
      if (!value || typeof value === "boolean") {
        return <span>---</span>;
      }
      const date = new Date(value.toString().replace(" ", "T"));

      const seconds = differenceInSeconds(date, new Date());

      if (seconds > 0) {
        return (
          <span title={format(date, "dd/MM/yyyy HH:mm")}>
            {formatDistanceToNow(date, {
              locale: ptBR,
              addSuffix: true,
            }).replace("em cerca de", "em")}
          </span>
        );
      }

      return (
        <span title={format(date, "dd/MM/yyyy HH:mm")}>
          atrasado{" "}
          {formatDistanceToNow(date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
      );
    },
  },
  {
    key: "backupsDays",
    title: "Hoje",
    render: (value) => (
      <span>
        2
      </span>
    )
  },
  {
    key: "backupsDays",
    title: "Frequência",
    render: (value) => (
      <span>
        {value?.toString()}x dia
      </span>
    )
  },
  {
    key: "retentionDays",
    title: "Retenção",
    render: (value) => (
      <span>
        {value?.toString()} dias
      </span>
    )
  }
]

export function BackupsRestoresPages() {
  const { isLoading, data, isError, refetch } = useFetchBackups({
    page: 1,
    perPage: 10,
  })

  return (
    <>
      <HeaderPage
        title="Backups/Restores"
        description="Central de gerenciamento, monitoramento e controle das rotinas de backup, restauração de dados e execução de automações."
        icon={DatabaseBackup}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Backups/Restores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex-1 px-16 py-8 space-y-6">
        <TableComponent
          data={data?.backups ?? []}
          // cardsQuantity={{
          //   summarys: summarys ?? [],
          //   isLoading: isLoadingSummary,
          // }}
          registerName="Backups"
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
          // onPageChange={setPage}
          actions={(document) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" >
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}> <Play /> Executar Backup
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>
    </>
  )
}