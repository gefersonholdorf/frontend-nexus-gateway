import { FileText, Pencil, Archive as ArchiveIcon, Eye, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { HeaderPage } from "@/components/header-page";
import { TableComponentV2, type Column } from "@/components/table-component-v2";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";
import { Can } from "@/modules/auth/components/can";

import { ArchiveDocumentoDialog } from "../components/archive-documento-dialog";
import { CreateDocumentoModal } from "../components/create-documento-modal";
import { DocumentoStatusBadge } from "../components/documento-status-badge";
import { useFetchDocAreas } from "../hooks/use-fetch-doc-areas";
import { useFetchDocCategorias } from "../hooks/use-fetch-doc-categorias";
import { useFetchDocumentos, type DocumentoListItem, type DocumentoStatus } from "../hooks/use-fetch-documentos";
import { useGetRolesSelect } from "../hooks/use-get-roles-select";
import { useGetUsuariosSelect } from "../hooks/use-get-usuarios-select";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: DocumentoStatus[] = [
    "RASCUNHO",
    "EM_REVISAO",
    "EM_APROVACAO",
    "APROVADO",
    "PUBLICADO",
    "REPROVADO",
    "ARQUIVADO",
];

const STATUS_LABEL: Record<DocumentoStatus, string> = {
    RASCUNHO: "Rascunho",
    EM_REVISAO: "Em Revisão",
    EM_APROVACAO: "Em Aprovação",
    APROVADO: "Aprovado",
    PUBLICADO: "Publicado",
    REPROVADO: "Reprovado",
    ARQUIVADO: "Arquivado",
};

const ALL_VALUE = "all";

export function DocumentosPage() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [categoria, setCategoria] = useState<string>(ALL_VALUE);
    const [area, setArea] = useState<string>(ALL_VALUE);
    const [status, setStatus] = useState<string>(ALL_VALUE);
    const [role, setRole] = useState<string>(ALL_VALUE);
    const [page, setPage] = useState(1);

    const [createOpen, setCreateOpen] = useState(false);
    const [archiveDocumento, setArchiveDocumento] = useState<DocumentoListItem | null>(null);

    const { data: categorias } = useFetchDocCategorias();
    const { data: areas } = useFetchDocAreas();
    const { data: roles } = useGetRolesSelect();
    const { data: usuarios } = useGetUsuariosSelect();

    // A listagem (`GET /documentos`) só traz ids crus (`cd_categoria`,
    // `cd_area`, `cd_responsavel`) — os rótulos são resolvidos no client a
    // partir dos dados de referência já buscados para os filtros/formulários.
    const categoriaSiglaById = useMemo(
        () => new Map((categorias ?? []).map((c) => [c.cd_id, c.ds_sigla])),
        [categorias],
    );
    const areaSiglaById = useMemo(
        () => new Map((areas ?? []).map((a) => [a.cd_id, a.ds_sigla])),
        [areas],
    );
    const usuarioNomeById = useMemo(
        () => new Map((usuarios ?? []).map((u) => [u.cd_id, u.ds_name])),
        [usuarios],
    );

    const params = useMemo(
        () => ({
            q: debouncedSearch || undefined,
            categoria: categoria !== ALL_VALUE ? Number(categoria) : undefined,
            area: area !== ALL_VALUE ? Number(area) : undefined,
            status: status !== ALL_VALUE ? status : undefined,
            role: role !== ALL_VALUE ? Number(role) : undefined,
            page,
            pageSize: PAGE_SIZE,
        }),
        [debouncedSearch, categoria, area, status, role, page],
    );

    const { data, isLoading, isError, refetch } = useFetchDocumentos(params);

    function handleFilterChange(setter: (value: string) => void, value: string) {
        setter(value);
        setPage(1);
    }

    // LIMITAÇÃO DO BACKEND: `GET /documentos` não traz `totalPages` — só
    // `{items, page, pageSize, total}` (mesmo padrão de `core-users-page.tsx`/
    // `core-roles-page.tsx`/`hub-services-page.tsx`). Calculado no client.
    const pagination = data
        ? (() => {
              const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
              return {
                  page: data.page,
                  perPage: data.pageSize,
                  total: data.total,
                  totalPages,
                  hasNextPage: data.page < totalPages,
                  hasPreviousPage: data.page > 1,
              };
          })()
        : undefined;

    const columns: Column<DocumentoListItem>[] = [
        { key: "ds_codigo", title: "Código" },
        { key: "ds_titulo", title: "Título" },
        {
            key: "cd_categoria",
            title: "Categoria",
            render: (_, row) => categoriaSiglaById.get(row.cd_categoria) ?? "-",
        },
        {
            key: "cd_area",
            title: "Área",
            render: (_, row) => areaSiglaById.get(row.cd_area) ?? "-",
        },
        {
            key: "cd_responsavel",
            title: "Responsável",
            render: (_, row) => usuarioNomeById.get(row.cd_responsavel) ?? "-",
        },
        {
            key: "st_status",
            title: "Status",
            render: (value) => <DocumentoStatusBadge status={value as DocumentoStatus} />,
        },
        {
            key: "ds_versao_major",
            title: "Versão",
            render: (_, row) => `${row.ds_versao_major}.${row.ds_versao_minor}`,
        },
    ];

    return (
        <>
            <HeaderPage
                title="Documentos"
                description="Cadastro, versionamento, revisão e aprovação de documentos internos."
                icon={FileText}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Gestão de Documentos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <Can permission="documento.criar" fallback={null}>
                        <Button size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Novo documento
                        </Button>
                    </Can>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={data?.items ?? []}
                    columns={columns}
                    registerName="documentos"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    pagination={pagination}
                    onPageChange={setPage}
                    onRowClick={(row) => navigate(`/gestao-documentos/${row.cd_id}`)}
                    filteringComponent={
                        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:flex-wrap">
                            <Input
                                placeholder="Buscar por código ou título"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="lg:max-w-xs"
                            />

                            <Select value={categoria} onValueChange={(v) => handleFilterChange(setCategoria, v)}>
                                <SelectTrigger className="lg:w-44">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_VALUE}>Todas as categorias</SelectItem>
                                    {(categorias ?? []).map((c) => (
                                        <SelectItem key={c.cd_id} value={String(c.cd_id)}>
                                            {c.ds_nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={area} onValueChange={(v) => handleFilterChange(setArea, v)}>
                                <SelectTrigger className="lg:w-44">
                                    <SelectValue placeholder="Área" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_VALUE}>Todas as áreas</SelectItem>
                                    {(areas ?? []).map((a) => (
                                        <SelectItem key={a.cd_id} value={String(a.cd_id)}>
                                            {a.ds_nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={(v) => handleFilterChange(setStatus, v)}>
                                <SelectTrigger className="lg:w-44">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_VALUE}>Todos os status</SelectItem>
                                    {STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {STATUS_LABEL[s]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={role} onValueChange={(v) => handleFilterChange(setRole, v)}>
                                <SelectTrigger className="lg:w-44">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_VALUE}>Todas as roles</SelectItem>
                                    {(roles ?? []).map((r) => (
                                        <SelectItem key={r.cd_id} value={String(r.cd_id)}>
                                            {r.ds_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    actions={(documento) => (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            navigate(`/gestao-documentos/${documento.cd_id}`);
                                        }}
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ver detalhes</TooltipContent>
                            </Tooltip>

                            <Can permission="documento.editar" fallback={null}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/gestao-documentos/${documento.cd_id}?editar=1`);
                                            }}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar</TooltipContent>
                                </Tooltip>
                            </Can>

                            <Can permission="documento.arquivar" fallback={null}>
                                {documento.st_status !== "ARQUIVADO" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-destructive hover:text-destructive"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setArchiveDocumento(documento);
                                                }}
                                            >
                                                <ArchiveIcon className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Arquivar</TooltipContent>
                                    </Tooltip>
                                )}
                            </Can>
                        </>
                    )}
                />
            </div>

            <CreateDocumentoModal open={createOpen} onOpenChange={setCreateOpen} />

            <ArchiveDocumentoDialog
                open={Boolean(archiveDocumento)}
                onOpenChange={(next) => !next && setArchiveDocumento(null)}
                documento={archiveDocumento}
            />
        </>
    );
}
