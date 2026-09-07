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
import { KeyRound, Text } from "lucide-react";
import { useMemo } from "react";

import { MonoValue } from "../components/core-mono-value";
import { useFetchPermissions } from "../hooks/use-fetch-permissions";
import type { CorePermission } from "../mocks/permissions.mock";

const columns: Column<CorePermission>[] = [
    {
        key: "ds_key",
        title: "Chave",
        icon: KeyRound,
        render: (value) => <MonoValue>{value as string}</MonoValue>,
    },
    {
        key: "ds_name",
        title: "Nome",
    },
    {
        key: "ds_description",
        title: "Descrição",
        icon: Text,
    },
];

export function CorePermissionsPage() {
    const { data, isLoading, isError, refetch } = useFetchPermissions();

    const items = data ?? [];

    const summarys = useMemo(
        () => [
            {
                title: "Permissões no catálogo",
                value: items.length,
                icon: KeyRound,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
        ],
        [items.length],
    );

    return (
        <>
            <HeaderPage
                title="Permissões"
                description="Catálogo fixo de permissões do sistema. Somente leitura — a atribuição é feita a partir da tela de Roles."
                icon={KeyRound}
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
                                <BreadcrumbLink href="/core/roles">Roles</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Permissões</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Catálogo fixo (RN008): nenhuma ação de criar/editar/excluir permissão. */}
                <TableComponentV2
                    data={items}
                    columns={columns}
                    registerName="Permissões"
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
