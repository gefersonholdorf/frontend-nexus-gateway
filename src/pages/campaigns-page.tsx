import { useCreateCampaign } from "@/api/campaigns/create-campaign";
import { useFetchCampaigns, type Campaign } from "@/api/campaigns/fetch-campaigns";
import { useFetchSummaryCampaign } from "@/api/campaigns/fetch-summary";
import { useUpdateCampaign } from "@/api/campaigns/update-campaign";
import { CampaignFormModal } from "@/components/campaigns/create-campaign";
import { DeleteCampaignModal } from "@/components/campaigns/delete-campaign-modal";
import { FilteringCampaigns, type Filters } from "@/components/campaigns/filtering-campaigns";
import { UserByCampaignComponent } from "@/components/campaigns/users-by-campaign-component";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/contexts/user-context";
import { formatDate } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Clock1,
  Edit,
  FileText,
  Megaphone,
  MoreHorizontalIcon,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { useState } from "react";

const columns: Column<Campaign>[] = [
  {
    key: "code",
    title: "Código",
    render: (value) => (
      <div className="flex items-center gap-1 text-[.8rem] font-medium">
        <span>{value?.toString()}</span>
      </div>
    )
  },
  {
    key: "title",
    title: "Campanha",
    render: (value) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate max-w-64 font-medium">
            <span>{value?.toString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span>{value?.toString()}</span>
        </TooltipContent>
      </Tooltip>
    )
  },
  {
    key: "monthYear",
    title: "Mês/Ano",
    render: (value) => (
      <div className="text-sm">
        {value?.toString()}
      </div>
    )
  },
  {
    key: "publishDate",
    title: "Data de publicação",
    render: (value) => (
      <div className="text-sm">
        {formatDate(value!.toString(), "dd/MM/yyyy HH:mm")}
      </div>
    )
  },
  {
    key: "status",
    title: "Status",
    render: (_, row) => (
      <div className="flex items-center gap-1">
        {row.status === 'PUBLISHED' && (
          <Badge className="bg-transparent text-emerald-500 border border-border">
            <CheckCircle className="size-4 mr-1 text-emerald-500" />
            Publicada
          </Badge>
        )}
        {row.status === 'SCHEDULED' && (
          <Badge className="bg-transparent text-blue-500 border border-border">
            <Clock className="size-4 mr-1 text-blue-500" />
            Agendada
          </Badge>
        )}
        {row.status === 'DRAFT' && (
          <Badge className="bg-transparent text-amber-500 border border-border">
            <FileText className="size-4 mr-1 text-amber-500" />
            Rascunho
          </Badge>
        )}
        {row.status === 'INACTIVE' && (
          <Badge className="bg-transparent text-red-500 border border-border">
            <AlertCircle className="size-4 mr-1 text-red-500" />
            Encerrada
          </Badge>
        )}
      </div>
    )
  },
  {
    key: "accessStats",
    title: "Acessos",
    render: (value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return <span className="text-sm">—</span>;
      }

      const stats = value as CampaignAccessStats;
      const percentage = stats.total > 0 ? Math.round((stats.accessed / stats.total) * 100) : 0;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col gap-1.5 w-36">
              <div className="flex items-center justify-between text-xs">
                <span className="">
                  {stats.accessed} / {stats.total} usuários
                </span>
                <span className="font-medium text-emerald-600">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-1.5" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-xs">
              <p><span className="text-emerald-500">●</span> Acessaram: {stats.accessed}</p>
              <p><span className="text-blue-500">●</span> Visualizaram: {stats.viewed}</p>
              <p><span className="text-slate-400">●</span> Pendentes: {stats.pending}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    key: "responsible",
    title: "Responsável",
    render: (value) => {
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        !("name" in value)
      ) {
        return null;
      }

      const responsible = value as CampaignResponsible;

      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8">
                <AvatarImage src={responsible.avatarUrl ?? ""} />
                <AvatarFallback className="bg-primary/90 text-white text-xs">
                  {responsible.name[0]}
                  {responsible.name.split(" ").length > 1
                    ? responsible.name.split(" ")[1][0]
                    : ""}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{responsible.name}</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-sm truncate max-w-28">
            {responsible.name}
          </span>
        </div>
      );
    },
  }
];

export interface CampaignResponsible {
  id: number;
  name: string;
  avatarUrl: string | null;
}

export interface CampaignAccessStats {
  total: number;
  accessed: number;
  viewed: number;
  pending: number;
}
export interface CampaignFilters {
  text: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'INACTIVE' | 'all';
  monthYear: string | 'all';
}

export function CampaignsPage() {
  const { user } = useUser();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [usersCampaign, setUsersCampaign] = useState<number | null>(null);
  const [openUsersCampaign, setOpenUsersCampaign] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const [page, setPage] = useState(1);
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();

  const [filters, setFilters] = useState<CampaignFilters>({
    text: "",
    status: "all",
    monthYear: "",
  });

  const { data } = useFetchCampaigns({
    page: 1,
    perPage: 10,
    text: filters.text,
    status: filters.status,
    monthYear: filters.monthYear,
  })

  const { isLoading: isLoadingSummary, data: dataSummary } = useFetchSummaryCampaign({
    text: filters.text,
    status: filters.status,
    monthYear: filters.monthYear,
  });

  function handleSetOpenCreateModal() {
    setOpenCreateModal(!openCreateModal);
  }

  function handleSetOpenUpdateModal() {
    setOpenUpdateModal(!openUpdateModal);
  }

  function handleSetUsersCampaign(campaignId: number | null) {
    setUsersCampaign(campaignId);
  }

  function handleSetOpenUsersCampaign() {
    setOpenUsersCampaign(!openUsersCampaign);
  }

  function handleFiltering(newFilters: Filters) {
    setFilters(newFilters);
    setPage(1);
  }

  const summaryCards = dataSummary?.summary
    ? [
        {
          title: "Total de campanhas",
          value: dataSummary?.summary.total,
          icon: Megaphone,
          colorText: "text-primary",
          borderColor: "hover:border-primary",
        },
        {
          title: "Publicadas",
          value: dataSummary?.summary.published,
          icon: CheckCircle,
          colorText: "text-emerald-500",
          borderColor: "hover:border-emerald-500",
        },
        {
          title: "Agendadas",
          value: dataSummary?.summary.scheduled,
          icon: Clock1,
          colorText: "text-blue-500",
          borderColor: "hover:border-blue-500",
        },
        {
          title: "Encerrados",
          value: dataSummary?.summary.inactive,
          icon: X,
          colorText: "text-red-500",
          borderColor: "hover:border-violet-500",
        },
        {
          title: "Rascunhos",
          value: dataSummary?.summary.draft,
          icon: FileText,
          colorText: "text-slate-500",
          borderColor: "hover:border-slate-500",
        },
      ]
    : [];

  return (
    <>
      <HeaderPage
        title="Campanhas"
        description="Gerencie campanhas e comunicações internas da empresa."
        icon={Megaphone}
        actions={
          user?.roles?.includes("Administrador") && (
            <div className="flex gap-2">
              <Button onClick={() => setOpenCreateModal(true)}>
                <Plus className="size-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
          )
        }
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Campanhas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="flex-1 px-16 py-8 space-y-6">
        <TableComponent
          data={data?.campaigns ?? []}
          cardsQuantity={{
            summarys: summaryCards,
            isLoading: isLoadingSummary,
          }}
          registerName="Campanhas"
          isLoading={false}
          isError={false}
          onRetry={() => { }}
          filteringComponent={
            <FilteringCampaigns onFilterChange={handleFiltering} />
          }
          columns={columns}
          pagination={
            data?.pagination ?? {
              page,
              perPage: 10,
              total: 0,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            }
          }
          onPageChange={setPage}
          actions={(campaign) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  disabled={!campaign.url}
                  onClick={() => campaign.url && window.open(campaign.url, "_blank")}
                >
                  <Megaphone className="size-4 mr-2" />
                  Acessar Campanha
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => {
                  handleSetUsersCampaign(campaign.id)
                  handleSetOpenUsersCampaign();
                }}>
                  <BarChart3 className="size-4 mr-2" />
                  Acompanhamento
                </DropdownMenuItem>

                {user?.roles.includes("Administrador") && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => {
                      setCampaign(campaign);
                      handleSetOpenUpdateModal();
                    }}>
                      <Edit className="size-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DeleteCampaignModal campaign={campaign}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="size-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                    </DeleteCampaignModal>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>

      <CampaignFormModal
        mode="create"
        open={openCreateModal}
        onOpenChange={handleSetOpenCreateModal}
        isPending={createMutation.isPending}
        onSubmit={async (data) => {
          await createMutation.mutateAsync(data);
        }}
      />

      <UserByCampaignComponent 
        open={openUsersCampaign}
        onOpenChange={handleSetOpenUsersCampaign}
        campaignId={usersCampaign}
      />

      <CampaignFormModal
        mode="update"
        open={openUpdateModal}
        onOpenChange={handleSetOpenUpdateModal}
        defaultValues={{
          code: campaign?.code || "",
          title: campaign?.title || "",
          description: campaign?.description || "",
          monthYear: campaign?.monthYear || "",
          publishDate: campaign?.publishDate || "",
          status: campaign?.status,
          url: campaign?.url || "",
        }}
        isPending={updateMutation.isPending}
        onSubmit={async (data) => {
          await updateMutation.mutateAsync({
            id: campaign!.id,
            ...data,
          });
        }}
      />
    </>
  );
}