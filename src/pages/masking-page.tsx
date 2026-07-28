import { useGetDataMasking, type DataMaskingResponse } from "@/api/maskings/get-data-masking";
import { HeaderPage } from "@/components/header-page";
import DataMaskingFlowPage from "@/components/maskings/masking-component";
import { TableComponent, type Column } from "@/components/table-component";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { EyeOff } from "lucide-react";

const columns: Column<DataMaskingResponse>[] = [
    {
        key: "execution",
        title: "Execução",
        render: (_, row) => (
            <span className="flex items-center gap-2">
                {row.execution.executionId}
            </span>
        )
    },
]

export function MaskingPage() {
    const { isLoading, data, isError, refetch } = useGetDataMasking()

    return (
        <>
            <HeaderPage
                title="Mascaramento de Dados"
                description="Central de gerenciamento, monitoramento e acompanhamento das execuções de mascaramento de dados."
                icon={EyeOff}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Mascaramento</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <TableComponent
                    data={data ?? []}
                    // cardsQuantity={{
                    //   summarys: summarys ?? [],
                    //   isLoading: isLoadingSummary,
                    // }}
                    registerName="Backups"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    // filteringComponent={
                    //   <FilteringDocuments onFilterChange={handleFiltering} />
                    // }
                    columns={columns}
                    // pagination={
                    //     data?.pagination ?? {
                    //         page: 1,
                    //         perPage: 10,
                    //         total: 0,
                    //         totalPages: 1,
                    //         hasNextPage: false,
                    //         hasPreviousPage: false,
                    //     }
                    // }
                    // onPageChange={setPage}
                />
                <DataMaskingFlowPage />
            </div>
        </>
    )
}