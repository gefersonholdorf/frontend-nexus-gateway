import { useFetchDocuments } from "@/api/documents/fetch-documents";
import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { BackComponent } from "@/components/back-component";
import { CardDocuments } from "@/components/documents/cards-documents";
import { CreateDocumentModal } from "@/components/documents/create-document-modal";
import { FilteringDocuments, type Filters } from "@/components/documents/filtering-documents";
import { TableComponent, type Column } from "@/components/table-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "date-fns";
import { CheckCircle, Clock, Edit, Eye, FileText, IdCard, MoreHorizontalIcon, Plus, X, XCircle } from "lucide-react";
import {
  User,
  Shield,
  Calendar,
  Tag,
} from "lucide-react"
import { useState } from "react";

const columns: Column<Document>[] = [
  {
    key: "code",
    title: "Código",
    icon: IdCard,
    render: (value) => (
      <div className="flex items-center gap-1 text-[.8rem]">
        <span>{value}</span>
      </div>
    )
  },
  {
    key: "title",
    title: "Documento",
    icon: FileText,
    render: (value) => (
      <div className="truncate max-w-70">
        <span>{value}</span>
      </div>
    )
  },
  {
    key: "category",
    title: "Categoria",
    icon: Tag,
  },
  {
    key: "status",
    title: "Status",
    icon: Shield,
    render: (value) => (
      <div className="flex items-center gap-1">
        {value === 'Vigente' && (
          <>
            <Badge className="bg-emerald-600">
              <CheckCircle className="size-3" />
              Vigente
            </Badge>
          </>
        )}
        {value === 'Pendente' && (
          <>
            <Badge className="bg-red-500">
              <XCircle className="size-3" />
              Pendente
            </Badge>
          </>
        )}
        {value === 'Em Andamento' && (
          <>
            <Badge className="bg-gray-500">
              <Clock className="size-3" />
              Em Andamento
            </Badge>
          </>
        )}
        {value === 'Em Revisão' && (
          <>
            <Badge className="bg-amber-600">
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
    title: "Atualizado",
    icon: Calendar,
    render: (value) => (
      <div>
        {formatDate(value, "dd/MM/yyyy - HH:mm")}
      </div>
    )
  },
  {
    key: "responsible",
    title: "Responsável",
    icon: User,
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

  const documents: Document[] = data ? data.documents : []

  function handleSetOpenCreateModal() {
    setOpenCreateModal(!openCreateModal)
  }

  return (
    <>
      <div className="px-10 pt-6 flex justify-start items-start border-b border-border bg-background p-4 rounded-b-lg">
        <div className="w-full flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <BackComponent />
            <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-background/20">
              <FileText className="text-primary size-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Documentos ISO</h1>
              <p className="text-muted-foreground text-[.8rem]">Central de documentos, políticas, procedimentos e registros do Sistema de Gestão de Segurança da Informação.</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setOpenCreateModal(true)}
        >
          <Plus />
          Adicionar Documento
        </Button>
      </div>
      <div className="flex-1 px-16 py-8 space-y-6">
        {isLoadingSummary || !dataSummary ? (
          <Skeleton />
        ) : (
          <CardDocuments onData={dataSummary.summary} />
        )}
        <FilteringDocuments
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
        />
        {isLoading && (
          <Skeleton />
        )}
        {!data && (
          <div>
            Erro ao listar dados
          </div>
        )}
        {data && data.documents.length > 0 ? (
          <TableComponent
            data={documents}
            columns={columns}
            caption="Documentos ISO"
            pagination={data.pagination}
            onPageChange={setPage}
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
                  <DropdownMenuItem
                    onClick={() => window.open(`${document.url}`, "_blank")}
                  >
                    <Eye />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <X />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        ) : (
          <div>
            Nenhum resultado
          </div>
        )}
      </div>
      <CreateDocumentModal open={openCreateModal} onOpenChange={handleSetOpenCreateModal} />
    </>
  )
}