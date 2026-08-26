import { useCreateDocumentEvent } from "@/api/documents/create-document-event";
import { useFetchDocuments } from "@/api/documents/fetch-documents";
import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { useFetchUserLists } from "@/api/users/use-users-list";
import { DeleteDocumentModal } from "@/components/documents/delete-document";
import { FilteringDocuments, type Filters } from "@/components/documents/filtering-documents";
import { DocumentsModulesComponent } from "@/components/documents/modules";
import { CreateReviewModal } from "@/components/documents/revisions/create-review-modal";
import { HeaderPage } from "@/components/header-page";
import { TableComponent, type Column } from "@/components/table-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/contexts/user-context";
import { formatDate } from "date-fns";
import { CheckCircle, ClipboardClock, Clock, ClockAlert, Edit, Eye, FileText, MoreHorizontalIcon, SquarePen, X, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const columns: Column<Document>[] = [
  {
    key: "title",
    title: "Documento",
    render: (_, row) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate max-w-60 flex flex-col">
            <span className="truncate">{row.title.toString()}</span>
            <span className="text-[.8rem] text-muted-foreground">{row.code}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {row.title.toString()}
          </span>
        </TooltipContent>
      </Tooltip>
    )
  },
  {
    key: "category",
    title: "Categoria",
    render: (_, row) => {
      if (!row.classification) {
        return (
          <div className="flex flex-col">
            <span>{row.category}</span>
            <span>---</span>
          </div>
        )
      }

      return (
        <div className="flex flex-col">
          <span>{row.category}</span>
          <span className="text-muted-foreground text-[.8rem]">{row.classification}</span>
        </div>
      )
    }
  },
  {
    key: "version",
    title: "Versão",
    render: (value) => {
      if (!value) {
        return (
          <span>---</span>
        )
      }

      return (
        <span>{value.toString()}</span>
      )
    }
  },
  {
    key: "status",
    title: "Status",
    render: (value) => (
      <div className="flex items-center gap-1">
        {value === 'VIGENTE' && (
          <>
            <Badge className="bg-transparent text-primary-text/10 border border-border">
              <CheckCircle className="size-4 text-emerald-500" />
              <span className="text-emerald-500">Vigente</span>
            </Badge>
          </>
        )}
        {value === 'RASCUNHO' && (
          <>
            <Badge className="bg-transparent text-primary-text/10 border border-border">
              <XCircle className="size-4 text-amber-500" />
              <span className="text-amber-500">Rascunho</span>
            </Badge>
          </>
        )}
        {value === 'EM_REVISAO' && (
          <>
            <Badge className="bg-transparent text-primary-text/10 border border-border">
              <Clock className="size-4 text-orange-500" />
              <span className="text-orange-500">Em Revisão</span>
            </Badge>
          </>
        )}
        {value === 'EXPIRADO' && (
          <>
            <Badge className="bg-transparent text-primary-text/10 border border-border">
              <X className="size-4 text-red-500" />
              <span className="text-red-500">Expirado</span>
            </Badge>
          </>
        )}
        {value === 'CANCELADO' && (
          <>
            <Badge className="bg-transparent text-primary-text/10 border border-border">
              <X className="size-4 text-gray-500" />
              <span className="text-gray-500">Cancelado</span>
            </Badge>
          </>
        )}
      </div>
    )
  },
  {
    key: "updatedAt",
    title: "Próxima Revisão",
    render: (_, row) => {
      if (!row.nextReview) {
        return (
          <span className="text-sm text-muted-foreground">
            ---
          </span>
        );
      }
      return (
        <div>
          {formatDate(row.nextReview.toString(), "dd/MM/yyyy")}
        </div>
      )
    }
  },
  {
    key: "owner",
    title: "Responsável",
    render: (_, row) => {
      if (!row.owner) {
        return (
          <span className="text-sm text-muted-foreground">
            ---
          </span>
        );
      }

      const initials = row.owner.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase();

      return (
        <Tooltip >
          <TooltipTrigger asChild>
            <div className="flex max-w-35 items-center gap-2 min-w-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage
                  src={row.owner.avatarUrl ?? ""}
                  alt={row.owner.name}
                />

                <AvatarFallback className="bg-primary/90 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium">
                  {row.owner.name}
                </span>

                {row.owner.roleDescription && (
                  <span className="truncate text-[.8rem] text-muted-foreground">
                    {row.owner.roleDescription}
                  </span>
                )}
              </div>
            </div>
          </TooltipTrigger>

          <TooltipContent>
            <div className="flex flex-col">
              <span className="font-medium">{row.owner.name}</span>

              {row.owner.roleDescription && (
                <span className="text-xs text-muted-foreground">
                  {row.owner.roleDescription}
                </span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  }
]

export interface Document {
  id: number
  code: string
  title: string
  viewUrl: string
  editUrl: string
  category: string
  status: string
  version: string | null
  createdAt: string
  updatedAt: string
  process: string | null
  classification: string | null
  nextReview: string | null
  profilesCount: number
  isDocumentRevisionPending: boolean
  reviewId: number | null
  profiles: {
    id: number
    name: string
    description: string | null
  }[]
  owner: {
    id: number
    name: string
    avatarUrl: string | null
    roleDescription: string | null
  } | null
}

export function DocumentsPage() {
  const { user } = useUser()
  const { data: users } = useFetchUserLists()
  const navigate = useNavigate()
  const [openUpdateModal, setOpenUpdateModal] = useState(false)

  const [createReviewOpen, setCreateReviewOpen] = useState(false)

  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null)

  function handleReview(document: Document) {
    setSelectedDocument(document)
    setCreateReviewOpen(true)
  }

  const [page, setPage] = useState(1)
  const createEventMutation = useCreateDocumentEvent();
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

  function handleSetOpenUpdateModal() {
    setOpenUpdateModal(!openUpdateModal)
  }

  function handleFiltering(newFilters: Filters) {
    setFilters(newFilters);
    setPage(1);
  }

  const handleCreateDocumentEvent = async (documentId: number) => {
    try {
      createEventMutation.mutateAsync({ id: documentId });
    } catch (error) {
      console.error("Erro ao criar evento do documento:", error);
    }
  };
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
        title: "Aprovação",
        value: dataSummary.summary.pendingApproval,
        icon: XCircle,
        colorText: "text-emerald-400",
        borderColor: "hover:border-emerald-400",
      },
      {
        title: "Revisão",
        value: dataSummary.summary.revision,
        icon: ClipboardClock,
        colorText: "text-orange-500",
        borderColor: "hover:border-orange-500",
      },
      {
        title: "Rascunho",
        value: dataSummary.summary.sketch,
        icon: SquarePen,
        colorText: "text-amber-500",
        borderColor: "hover:border-amber-500",
      },
      {
        title: "Expirado",
        value: dataSummary.summary.expired,
        icon: ClockAlert,
        colorText: "text-red-400",
        borderColor: "hover:border-red-400",
      }
    ]
    : [];

  return (
    <>
      <HeaderPage
        title="Gestão de Documentos"
        description="Central de documentos, políticas, procedimentos e registros do Sistema de Gestão de Segurança da Informação."
        icon={FileText}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Documentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="px-10 mb-6">
        <DocumentsModulesComponent />
      </div>
      <div className="flex-1 px-16 pb-8 space-y-6">
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
            data?.pagination ??
            {
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
                <DropdownMenuItem disabled={!document.viewUrl} onClick={() => {
                  window.open(`${document.viewUrl}`, "_blank")
                  handleCreateDocumentEvent(document.id)
                }}>
                  <Eye /> Visualizar (PDF)
                </DropdownMenuItem>
                {user?.roles.includes("Administrador") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={!document.editUrl} onClick={() => window.open(`${document.editUrl}`, "_blank")}>
                      <Eye /> Visualizar/Editar (DOCX)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
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
                <DropdownMenuSeparator />
                {document.isDocumentRevisionPending ? (
                  <DropdownMenuItem onClick={() => handleReview(document)}>
                    <Edit />
                    Criar Revisão
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate(`/documents/reviews/${document.reviewId}`)}>
                    <Edit />
                    Continuar Revisão
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div >
      <CreateReviewModal
        open={createReviewOpen}
        onOpenChange={setCreateReviewOpen}
        document={
          selectedDocument
            ? {
              id: selectedDocument.id,
              code: selectedDocument.code,
              title: selectedDocument.title,
              currentVersion:
                selectedDocument.version ?? "1.0",
              status: selectedDocument.status,
            }
            : null
        }
        users={
          users?.users ?? []
        }
        currentUserId={1}
        nextVersion="1.1"
        nextRevisionCode="R01"
        isPending={false}
      />
    </>
  )
}