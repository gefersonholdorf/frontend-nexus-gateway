import { useFetchDocuments } from "@/api/documents/fetch-documents";
import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { CreateDocumentModal } from "@/components/documents/create-document-modal";
import { DeleteDocumentModal } from "@/components/documents/delete-document";
import { EditDocumentModal } from "@/components/documents/edit-document-modal";
import { FilteringDocuments, type Filters } from "@/components/documents/filtering-documents";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  {
    key: "responsible",
    title: "Responsável",
  },
]

interface Document {
  id: number
  code: string
  title: string
  url: string
  category: string
  status: string
  responsible: string
  updatedAt: string
}

export function DocumentsPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [editDocument, setEditDocument] = useState<Document | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    text: "",
    category: "all",
    status: "all",
    department: "all",
  });

  const { isLoading, data, isError, refetch } = useFetchDocuments({
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

  function handleSetOpenCreateModal() {
    setOpenCreateModal(!openCreateModal)
  }

  function handleSetOpenUpdateModal() {
    setOpenUpdateModal(!openUpdateModal)
  }

  function handleSetEditDocument(document: Document) {
    setEditDocument(document)
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
        actions={
          <Button
            onClick={() => setOpenCreateModal(true)}
          >
            <Plus />
            Adicionar Documento
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(`${document.url}, "_blank"`)} >
                  <Eye /> Visualizar 
                </DropdownMenuItem> 
                <DropdownMenuSeparator /> 
                <DropdownMenuItem onClick={() => {
                  handleSetOpenUpdateModal()
                  handleSetEditDocument(document)
                }}>
                  <Edit /> Editar 
                  </DropdownMenuItem> 
                  <DeleteDocumentModal id={document.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}> <X /> Excluir
                </DropdownMenuItem> 
                </DeleteDocumentModal> 
              </DropdownMenuContent>
            </DropdownMenu>)} />
      </div>
      <CreateDocumentModal open={openCreateModal} onOpenChange={handleSetOpenCreateModal} />
      <EditDocumentModal open={openUpdateModal} onOpenChange={handleSetOpenUpdateModal} document={editDocument} />
    </>
  )
}