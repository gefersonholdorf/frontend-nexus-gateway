import { BackComponent } from "@/components/back-component";
import { CardDocuments } from "@/components/documents/cards-documents";
import { CreateDocumentModal } from "@/components/documents/create-document-modal";
import { FilteringDocuments } from "@/components/documents/filtering-documents";
import { TableComponent, type Column } from "@/components/table-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { CheckCircle, Clock, Edit, Eye, FileText, MoreHorizontalIcon, Plus, X, XCircle } from "lucide-react";
import {
  User,
  Shield,
  Calendar,
  Tag,
} from "lucide-react"

const documents: Document[] = [
  {
    id: 1,
    code: "POL-001",
    title: "Política de Segurança da Informação",
    documentUrl: "/documents/pol-001.pdf",
    category: "Política",
    version: "2.3",
    status: "Vigente",
    responsible: "Equipe de Segurança",
    createdAt: "2025-01-15",
    updatedAt: "2026-05-10",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 2,
    code: "POL-002",
    title: "Política de Controle de Acesso",
    documentUrl: "/documents/pol-002.pdf",
    category: "Política",
    version: "1.8",
    status: "Vigente",
    responsible: "Infraestrutura",
    createdAt: "2025-02-20",
    updatedAt: "2026-04-18",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 3,
    code: "PRC-001",
    title: "Procedimento de Backup e Recuperação",
    documentUrl: "/documents/prc-001.pdf",
    category: "Procedimento",
    version: "3.1",
    status: "Vigente",
    responsible: "Infraestrutura",
    createdAt: "2025-03-10",
    updatedAt: "2026-06-01",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 4,
    code: "PRC-002",
    title: "Procedimento de Gestão de Incidentes",
    documentUrl: "/documents/prc-002.pdf",
    category: "Procedimento",
    version: "2.0",
    status: "Em Revisão",
    responsible: "Segurança da Informação",
    createdAt: "2025-04-05",
    updatedAt: "2026-06-15",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 5,
    code: "MAN-001",
    title: "Manual de Uso do Sistema SentinelLog",
    documentUrl: "/documents/man-001.pdf",
    category: "Manual",
    version: "1.2",
    status: "Vigente",
    responsible: "Desenvolvimento",
    createdAt: "2025-06-12",
    updatedAt: "2026-05-22",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 6,
    code: "MAN-002",
    title: "Manual de Deploy Automatizado",
    documentUrl: "/documents/man-002.pdf",
    category: "Manual",
    version: "1.0",
    status: "Em Andamento",
    responsible: "DevOps",
    createdAt: "2026-01-08",
    updatedAt: "2026-06-20",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 7,
    code: "POL-003",
    title: "Política de Uso Aceitável de Recursos",
    documentUrl: "/documents/pol-003.pdf",
    category: "Política",
    version: "1.4",
    status: "Vigente",
    responsible: "Recursos Humanos",
    createdAt: "2025-07-14",
    updatedAt: "2026-03-12",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
  {
    id: 8,
    code: "PRC-003",
    title: "Procedimento de Gestão de Mudanças",
    documentUrl: "/documents/prc-003.pdf",
    category: "Procedimento",
    version: "2.5",
    status: "Pendente",
    responsible: "Comitê de Mudanças",
    createdAt: "2025-08-21",
    updatedAt: "2026-06-23",
    url: "https://lusati.sharepoint.com/:w:/r/sites/PROJETOS/_layouts/15/Doc.aspx?sourcedoc=%7BE2659F4E-AAE8-47DC-964F-A363B86ABEA1%7D&file=PROC%20SGSI%20004%20-%20Gest%C3%A3o%20de%20Indicadores%20do%20SGSI.docx&action=default&mobileredirect=true"
  },
]

const columns: Column<Document>[] = [
  {
    key: "code",
    title: "Código",
    icon: Tag,
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
  documentUrl: string
  category: "Manual" | "Política" | "Procedimento"
  version: string
  status: "Vigente" | "Em Revisão" | "Pendente" | "Em Andamento"
  url: string
  responsible: string
  createdAt: string
  updatedAt: string
}

export function DocumentsPage() {
  return (
    <>
      <div className="px-10 flex justify-start items-start border-b border-border bg-background p-4 rounded-b-lg">
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
        <Button><Plus /> Adicionar Documento</Button>
      </div>
      <div className="flex-1 px-16 py-8 space-y-6">
        <CardDocuments />
        <FilteringDocuments />
        <TableComponent
          data={documents}
          columns={columns}
          caption="Documentos ISO"
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
      </div>
      <CreateDocumentModal open={false} onOpenChange={() => {}} />
    </>
  )
}