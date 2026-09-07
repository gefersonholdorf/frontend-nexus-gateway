import { HeaderPage } from "@/components/header-page";
import { TableComponentV2, type Column } from "@/components/table-component-v2";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatDate } from "date-fns";
import { Boxes, Clock, History, Laptop, Network, User } from "lucide-react";
import { useMemo } from "react";

import { MonoValue } from "../components/core-mono-value";
import { useFetchCoreAudit } from "../hooks/use-fetch-core-audit";
import type { CoreAuditItem } from "../mocks/audit.mock";

const columns: Column<CoreAuditItem>[] = [
    {
        key: "ds_user",
        title: "Usuário",
        icon: User,
    },
    {
        key: "ds_module",
        title: "Módulo",
        icon: Boxes,
    },
    {
        key: "ds_action",
        title: "Ação",
        render: (value) => <span className="text-sm">{value as string}</span>,
    },
    {
        key: "dt_created_at",
        title: "Data/Hora",
        icon: Clock,
        render: (value) => <span>{formatDate(value as string, "dd/MM/yyyy HH:mm")}</span>,
    },
    {
        key: "ds_ip",
        title: "IP",
        icon: Network,
        render: (value) => <MonoValue>{value as string}</MonoValue>,
    },
    {
        key: "ds_agent",
        title: "Agente",
        icon: Laptop,
    },
];

export function CoreAuditPage() {
    // Etapa 7 traz filtros (usuário, ação, módulo, período); por ora, listagem completa.
    const { data, isLoading, isError, refetch } = useFetchCoreAudit();

    const items = data ?? [];

    const summarys = useMemo(
        () => [
            {
                title: "Eventos registrados",
                value: items.length,
                icon: History,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
        ],
        [items.length],
    );

    return (
        <>
            <HeaderPage
                title="Auditoria"
                description="Trilha de eventos administrativos do módulo Core. Tela somente leitura, dados mockados e estáticos."
                icon={History}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/core">Core</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Auditoria</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Somente leitura (RN013): sem botão de criação, sem ações por linha. */}
                <TableComponentV2
                    data={items}
                    columns={columns}
                    registerName="Eventos"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    cardsQuantity={{ summarys, isLoading }}
                />
            </div>
        </>
    );
}
