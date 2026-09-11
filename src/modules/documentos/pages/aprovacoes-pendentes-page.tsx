import { Gavel } from "lucide-react";
import { useState } from "react";
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

import { DecideAprovacaoDialog } from "../components/decide-aprovacao-dialog";
import {
    useFetchAprovacoesPendentes,
    type AprovacaoPendenteItem,
} from "../hooks/use-fetch-aprovacoes-pendentes";

const PAGE_SIZE = 10;

/** `GET /aprovacoes/pendentes` — `aprovacao.avaliar`; pendências do usuário autenticado. */
export function AprovacoesPendentesPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [decidir, setDecidir] = useState<AprovacaoPendenteItem | null>(null);

    const { data, isLoading, isError, refetch } = useFetchAprovacoesPendentes({
        page,
        pageSize: PAGE_SIZE,
    });

    // LIMITAÇÃO DO BACKEND: `GET /aprovacoes/pendentes` não traz `totalPages`
    // — só `{items, page, pageSize, total}`. Calculado no client, mesmo
    // padrão de `documentos-page.tsx`/`core-users-page.tsx`.
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

    const columns: Column<AprovacaoPendenteItem>[] = [
        {
            key: "ds_documento_codigo",
            title: "Documento",
            render: (_, row) => `${row.ds_documento_codigo ?? "-"} — ${row.ds_documento_titulo ?? "-"}`,
        },
        {
            key: "ds_etapa_nome",
            title: "Etapa",
            render: (_, row) => row.ds_etapa_nome ?? "-",
        },
        { key: "ds_rodada", title: "Rodada" },
    ];

    return (
        <>
            <HeaderPage
                title="Aprovações pendentes"
                description="Itens aguardando sua decisão em fluxos de aprovação de documentos."
                icon={Gavel}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/gestao-documentos">Documentos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Aprovações pendentes</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={data?.items ?? []}
                    columns={columns}
                    registerName="aprovações pendentes"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    pagination={pagination}
                    onPageChange={setPage}
                    actions={(item) => (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/gestao-documentos/${item.cd_documento}`)}
                            >
                                Ver documento
                            </Button>
                            <Button size="sm" onClick={() => setDecidir(item)}>
                                <Gavel className="size-4" />
                                Decidir
                            </Button>
                        </>
                    )}
                />
            </div>

            {decidir && (
                <DecideAprovacaoDialog
                    open={Boolean(decidir)}
                    onOpenChange={(next) => !next && setDecidir(null)}
                    documentoId={decidir.cd_documento}
                    revisaoId={decidir.cd_revisao}
                    aprovacaoId={decidir.cd_id}
                />
            )}
        </>
    );
}
