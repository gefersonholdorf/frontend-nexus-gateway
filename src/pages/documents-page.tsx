import { useCreateDocument } from "@/api/documents/create-document";
import { useFetchDocuments } from "@/api/documents/fetch-documents";
import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { useUpdateDocument } from "@/api/documents/update-document";
import { DeleteDocumentModal } from "@/components/documents/delete-document";
import { FilteringDocuments, type Filters } from "@/components/documents/filtering-documents";
import { DocumentFormModal } from "@/components/documents/form-document";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import { formatDate } from "date-fns";
import { CheckCircle, Clock, Edit, Eye, FileText, MoreHorizontalIcon, Plus, X, XCircle } from "lucide-react";
import { useState } from "react";

const columns: Column<Document>[] = [
  {
    key: "code",
    title: "Código",
    render: (value) => (
      <div className="flex items-center gap-1 text-[.8rem]">
        <span>{value}</span>
      </div>
    )
  },
  {
    key: "title",
    title: "Documento",
    render: (value) => (
      <div className="truncate max-w-70">
        <span>{value}</span>
      </div>
    )
  },
  {
    key: "category",
    title: "Categoria",
  },
  {
    key: "status",
    title: "Status",
    render: (value) => (
      <div className="flex items-center gap-1">
        {value === 'Vigente' && (
          <>
            <Badge className="bg-transparent text-emerald-500 border border-emerald-500">
              <CheckCircle className="size-3 text-emerald-500" />
              <span className="">Vigente</span>
            </Badge>
          </>
        )}
        {value === 'Pendente' && (
          <>
            <Badge className="bg-transparent text-red-500 border border-red-500">
              <XCircle className="size-3" />
              Pendente
            </Badge>
          </>
        )}
        {value === 'Em Andamento' && (
          <>
            <Badge className="bg-transparent text-blue-500 border border-blue-500">
              <Clock className="size-3" />
              Em Andamento
            </Badge>
          </>
        )}
        {value === 'Em Revisão' && (
          <>
            <Badge className="bg-transparent text-amber-500 border border-amber-500">
              <Edit className="size-3" />
              Em Revisão
            </Badge>
          </>
        )}
      </div>
    )
  },
  {
    key: "updatedAt",
    title: "Atualizado em",
    render: (value) => (
      <div>
        {formatDate(value, "dd/MM/yyyy - HH:mm")}
      </div>
    )
  },
]

export interface Document {
  id: number
  code: string
  title: string
  viewUrl: string
  editUrl: string
  category: string
  status: string
  createdAt: string
  updatedAt: string
}

export function DocumentsPage() {
  const { user } = useUser()
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [document, setDocument] = useState<Document | null>(null)

  const [page, setPage] = useState(1)
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();
  const [filters, setFilters] = useState<Filters>({
    text: "",
    category: "all",
    status: "all",
    profile: "all",
  });

  const { isLoading, data, isError, refetch } = useFetchDocuments({
    page,
    perPage: 10,
    text: filters.text,
    category: filters.category,
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

  function handleSetOpenCreateModal() {
    setOpenCreateModal(!openCreateModal)
  }

  function handleSetOpenUpdateModal() {
    setOpenUpdateModal(!openUpdateModal)
  }

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
      },
      {
        title: "Em Andamento",
        value: dataSummary.summary.progress,
        icon: Clock,
        colorText: "text-blue-500",
        borderColor: "hover:border-blue-500",
      },
      {
        title: "Pendentes",
        value: dataSummary.summary.pending,
        icon: XCircle,
        colorText: "text-red-500",
        borderColor: "hover:border-red-500",
      },
    ]
    : [];

  return (
    <>
      <HeaderPage
        title="Documentos ISO"
        description="Central de documentos, políticas, procedimentos e registros do Sistema de Gestão de Segurança da Informação."
        icon={FileText}
        actions=
        {user?.roles?.includes("Administrador") && (
          <Button
            onClick={() => setOpenCreateModal(true)}
          >
            <Plus />
            Adicionar Documento
          </Button>
        )}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Documentos ISO</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex-1 px-16 py-8 space-y-6">
        <TableComponent
          data={data?.documents ?? []}
          cardsQuantity={{
            summarys: summarys ?? [],
            isLoading: isLoadingSummary,
          }}
          registerName="Documentos"
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
          actions={(document) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" >
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuItem disabled={!document.viewUrl} onClick={() => window.open(`${document.viewUrl}`, "_blank")}>
                  <Eye /> Visualizar (PDF)
                </DropdownMenuItem>
                {user?.roles.includes("Administrador") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={!document.editUrl} onClick={() => window.open(`${document.viewUrl}`, "_blank")}>
                      <Eye /> Visualizar/Editar (DOCX)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setDocument(document);
                      handleSetOpenUpdateModal();
                    }}>
                      <Edit /> Editar Documento
                    </DropdownMenuItem>
                    <DeleteDocumentModal document={document}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}> <X /> Excluir
                      </DropdownMenuItem>
                    </DeleteDocumentModal>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>)} />
      </div>

      <DocumentFormModal
        mode="create"
        open={openCreateModal}
        onOpenChange={handleSetOpenCreateModal}
        isPending={createMutation.isPending}
        onSubmit={async (data) => {
          await createMutation.mutateAsync(data);
        }}
      />
      <DocumentFormModal
        mode="update"
        open={openUpdateModal}
        onOpenChange={handleSetOpenUpdateModal}
        defaultValues={{
          code: document?.code || "",
          title: document?.title || "",
          category: document?.category || "",
          status: document?.status || "",
          viewUrl: document?.viewUrl || "",
          editUrl: document?.editUrl || "",
        }}
        isPending={updateMutation.isPending}
        onSubmit={async (data) => {
          await updateMutation.mutateAsync({
            id: document!.id,
            ...data,
          });
        }}
      />
    </>
  )
}