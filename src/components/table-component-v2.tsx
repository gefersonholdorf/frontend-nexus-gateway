import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FileText, RefreshCw, TriangleAlert, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export interface CardsQuantity {
    summarys: {
        title: string
        value: number
        icon: LucideIcon
        colorText: string
        borderColor: string
    }[]
    isLoading: boolean
}

export type Column<T, K extends keyof T = keyof T> = {
    key: K
    title: string
    className?: string
    cellClassName?: string
    render?: (value: T[K], row: T) => React.ReactNode
    icon?: LucideIcon
}

export interface TableComponentProps<T> {
    data: T[]
    columns: Column<T>[]
    caption?: string
    actions?: (row: T) => React.ReactNode
    pagination?: {
        page: number
        perPage: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
    onPageChange?: (page: number) => void
    filteringComponent?: React.ReactNode
    registerName: string
    isLoading: boolean
    isError: boolean
    onRetry?: () => void
    cardsQuantity?: CardsQuantity
}

// Gera a janela de páginas com elipse: primeira, última, atual e vizinhas.
// O valor "ellipsis" indica onde renderizar as reticências.
type PageToken = number | "ellipsis-left" | "ellipsis-right"

function getPaginationRange(currentPage: number, totalPages: number): PageToken[] {
    const siblings = 1
    const totalNumbers = siblings * 2 + 5 // primeira + última + atual + 2 vizinhos + 2 elipses

    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(currentPage - siblings, 1)
    const rightSibling = Math.min(currentPage + siblings, totalPages)

    const showLeftEllipsis = leftSibling > 2
    const showRightEllipsis = rightSibling < totalPages - 1

    const range: PageToken[] = []

    // Sempre mostra a primeira página.
    range.push(1)

    if (showLeftEllipsis) {
        range.push("ellipsis-left")
    } else {
        for (let page = 2; page < leftSibling; page++) range.push(page)
    }

    for (let page = leftSibling; page <= rightSibling; page++) {
        if (page !== 1 && page !== totalPages) range.push(page)
    }

    if (showRightEllipsis) {
        range.push("ellipsis-right")
    } else {
        for (let page = rightSibling + 1; page < totalPages; page++) range.push(page)
    }

    // Sempre mostra a última página.
    range.push(totalPages)

    return range
}

export function TableComponentV2<T>({
    data,
    columns,
    actions,
    pagination,
    onPageChange,
    filteringComponent,
    registerName,
    isLoading,
    isError,
    onRetry,
    cardsQuantity,
}: TableComponentProps<T>) {
    const totalPages = pagination?.totalPages ?? 1
    const currentPage = pagination?.page ?? 1
    const pageTokens = getPaginationRange(currentPage, totalPages)

    const colSpan = columns.length + (actions ? 1 : 0)

    return (
        <div className="flex flex-col gap-4">
            {cardsQuantity && (
                <div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(var(--cards),minmax(0,1fr))]"
                    style={
                        {
                            "--cards": String(cardsQuantity.summarys.length),
                        } as React.CSSProperties
                    }
                >
                    {cardsQuantity.summarys.map((summary, index) => (
                        <CardQuantityComponent
                            key={`${summary.title}-${index}`}
                            summary={summary}
                            isLoading={cardsQuantity.isLoading}
                        />
                    ))}
                </div>
            )}

            <Card
                className="h-fit w-full gap-0 overflow-hidden rounded-xl border-none p-0 shadow-sm ring-1 ring-border/50
                   bg-(image:--background-gradient) transition-shadow duration-300 hover:shadow-md"
            >
                {filteringComponent}

                <div className="w-full overflow-x-auto">
                    <Table className="bg-(image:--background-gradient)">
                        <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
                            <TableRow className="border-b border-border/60 hover:bg-transparent">
                                {columns.map((column) => (
                                    <TableHead
                                        key={String(column.key)}
                                        scope="col"
                                        className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${column.className ?? ""}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.icon && <column.icon className="size-4 opacity-70" />}
                                            {column.title}
                                        </div>
                                    </TableHead>
                                ))}

                                {actions && (
                                    <TableHead
                                        scope="col"
                                        className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                    >
                                        <div className="flex items-center justify-end gap-1">Ações</div>
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-border/60">
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, rowIndex) => (
                                    <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                                        {columns.map((column, colIndex) => (
                                            <TableCell
                                                key={String(column.key)}
                                                className={`px-6 py-4 ${column.cellClassName ?? ""}`}
                                            >
                                                {/* Larguras variáveis deixam o skeleton mais natural. */}
                                                <Skeleton
                                                    className="h-5 rounded-md"
                                                    style={{ width: `${70 + ((colIndex * 13) % 30)}%` }}
                                                />
                                            </TableCell>
                                        ))}

                                        {actions && (
                                            <TableCell className="px-6 py-4 text-right">
                                                <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : isError ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={colSpan} className="h-40">
                                        <div className="flex flex-col items-center justify-center gap-4 py-16">
                                            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
                                                <TriangleAlert className="size-8 text-destructive" />
                                            </span>

                                            <div className="text-center">
                                                <p className="text-base font-semibold text-primary-text">
                                                    Ocorreu um erro ao carregar os dados
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Tente novamente em alguns instantes.
                                                </p>
                                            </div>

                                            {onRetry && (
                                                <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
                                                    <RefreshCw className="size-4" />
                                                    Tentar novamente
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={colSpan} className="h-40">
                                        <div className="flex flex-col items-center justify-center gap-4 py-16">
                                            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
                                                <FileText className="size-8 text-muted-foreground" />
                                            </span>

                                            <div className="text-center">
                                                <p className="text-base font-semibold text-primary-text">
                                                    Nenhum registro encontrado
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Tente alterar os filtros ou cadastrar um novo item.
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        className="transition-colors duration-150 hover:bg-muted/40"
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={String(column.key)}
                                                className={`px-6 py-4 align-middle ${column.cellClassName ?? ""}`}
                                            >
                                                {column.render
                                                    ? column.render(row[column.key], row)
                                                    : String(row[column.key] ?? "")}
                                            </TableCell>
                                        ))}

                                        {actions && (
                                            <TableCell className="px-6 py-2 text-right align-middle">
                                                {actions(row)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>

                        {pagination && (
                            <TableFooter className="bg-card/95">
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={2}>
                                        <div className="pl-4">
                                            <span className="text-[.8rem] text-muted-foreground tabular-nums">
                                                {data.length} de {pagination.total} {registerName}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell colSpan={999}>
                                        <Pagination className="flex flex-1 justify-end rounded-lg bg-transparent px-6 py-0">
                                            <PaginationContent className="flex-wrap">
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        aria-label="Página anterior"
                                                        aria-disabled={!pagination.hasPreviousPage}
                                                        className={
                                                            !pagination.hasPreviousPage
                                                                ? "pointer-events-none opacity-50"
                                                                : undefined
                                                        }
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            if (pagination.hasPreviousPage) {
                                                                onPageChange?.(pagination.page - 1)
                                                            }
                                                        }}
                                                    />
                                                </PaginationItem>

                                                {pageTokens.map((token) => {
                                                    if (token === "ellipsis-left" || token === "ellipsis-right") {
                                                        return (
                                                            <PaginationItem key={token}>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        )
                                                    }

                                                    return (
                                                        <PaginationItem key={token}>
                                                            <PaginationLink
                                                                href="#"
                                                                isActive={token === pagination.page}
                                                                aria-label={`Ir para a página ${token}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    onPageChange?.(token)
                                                                }}
                                                            >
                                                                {token}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        aria-label="Próxima página"
                                                        aria-disabled={!pagination.hasNextPage}
                                                        className={
                                                            !pagination.hasNextPage
                                                                ? "pointer-events-none opacity-50"
                                                                : undefined
                                                        }
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            if (pagination.hasNextPage) {
                                                                onPageChange?.(pagination.page + 1)
                                                            }
                                                        }}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </div>
            </Card>
        </div>
    )
}

interface CardQuantityComponentProps {
    summary: {
        title: string
        value: number
        icon: LucideIcon
        colorText: string
        borderColor: string
    }
    isLoading: boolean
}

export function CardQuantityComponent({ isLoading, summary }: CardQuantityComponentProps) {
    if (isLoading) {
        // Skeleton fiel ao layout final: ícone + duas linhas de texto.
        return (
            <Card className="flex flex-row items-center gap-3 rounded-xl p-3 px-6">
                <Skeleton className="size-11 rounded-lg" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                </div>
            </Card>
        )
    }

    return (
        <Card
            className={`flex flex-row items-center justify-start gap-3 rounded-xl border-b-[3px] border-transparent p-3 px-6 shadow-sm
                  ring-1 ring-border/50 ${summary.borderColor} bg-(image:--background-gradient)
                  transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
        >
            <div className={`${summary.colorText} rounded-lg border border-border bg-card p-3`}>
                <summary.icon className="size-5" />
            </div>

            <div className="flex flex-col items-start gap-0.5">
                <span className="text-2xl font-bold tabular-nums text-primary-text">
                    {summary.value}
                </span>
                <span className="text-[.8rem] text-muted-foreground">{summary.title}</span>
            </div>
        </Card>
    )
}