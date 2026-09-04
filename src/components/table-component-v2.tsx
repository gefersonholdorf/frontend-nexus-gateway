import type {
    CSSProperties,
    ReactNode,
} from "react"

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

import {
    FileText,
    RefreshCw,
    TriangleAlert,
    type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
export type Column<T> = {
    key: keyof T
    title: string
    className?: string
    cellClassName?: string
    render?: (
        value: T[keyof T],
        row: T,
    ) => ReactNode
    icon?: LucideIcon
}

export interface TableComponentProps<T> {
    data: T[]
    columns: Column<T>[]
    caption?: string

    actions?: (row: T) => ReactNode

    pagination?: {
        page: number
        perPage: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }

    onPageChange?: (page: number) => void

    filteringComponent?: ReactNode

    registerName: string

    isLoading: boolean
    isError: boolean

    onRetry?: () => void

    cardsQuantity?: CardsQuantity

    /**
     * Permite fornecer uma chave única e estável.
     *
     * Exemplo:
     * getRowKey={(row) => row.cd_id}
     */
    getRowKey?: (
        row: T,
        index: number,
    ) => string | number
}

type PageToken =
    | number
    | "ellipsis-left"
    | "ellipsis-right"

function getPaginationRange(
    currentPage: number,
    totalPages: number,
): PageToken[] {
    if (totalPages <= 0) {
        return []
    }

    if (totalPages === 1) {
        return [1]
    }

    const siblings = 1
    const totalVisibleItems = siblings * 2 + 5

    if (totalPages <= totalVisibleItems) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1,
        )
    }

    const safeCurrentPage = Math.min(
        Math.max(currentPage, 1),
        totalPages,
    )

    const leftSibling = Math.max(
        safeCurrentPage - siblings,
        1,
    )

    const rightSibling = Math.min(
        safeCurrentPage + siblings,
        totalPages,
    )

    const showLeftEllipsis =
        leftSibling > 2

    const showRightEllipsis =
        rightSibling < totalPages - 1

    const range: PageToken[] = [1]

    if (showLeftEllipsis) {
        range.push("ellipsis-left")
    } else {
        for (
            let page = 2;
            page < leftSibling;
            page++
        ) {
            range.push(page)
        }
    }

    for (
        let page = leftSibling;
        page <= rightSibling;
        page++
    ) {
        if (
            page !== 1 &&
            page !== totalPages
        ) {
            range.push(page)
        }
    }

    if (showRightEllipsis) {
        range.push("ellipsis-right")
    } else {
        for (
            let page = rightSibling + 1;
            page < totalPages;
            page++
        ) {
            range.push(page)
        }
    }

    range.push(totalPages)

    return range
}

export function TableComponentV2<T>({
    data,
    columns,
    caption,
    actions,
    pagination,
    onPageChange,
    filteringComponent,
    registerName,
    isLoading,
    isError,
    onRetry,
    cardsQuantity,
    getRowKey,
}: TableComponentProps<T>) {
    const totalPages =
        pagination?.totalPages ?? 1

    const currentPage =
        pagination?.page ?? 1

    const pageTokens =
        getPaginationRange(
            currentPage,
            totalPages,
        )

    const colSpan =
        columns.length +
        (actions ? 1 : 0)

    const firstItem =
        pagination &&
            pagination.total > 0
            ? (pagination.page - 1) *
            pagination.perPage +
            1
            : 0

    const lastItem = pagination
        ? Math.min(
            pagination.page *
            pagination.perPage,
            pagination.total,
        )
        : data.length

    function handlePageChange(
        page: number,
    ) {
        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return
        }

        onPageChange?.(page)
    }

    return (
        <section
            className="flex w-full flex-col gap-4"
            aria-busy={isLoading}
        >
            {cardsQuantity && (
                <SummaryCards
                    cardsQuantity={
                        cardsQuantity
                    }
                />
            )}

            <Card className="w-full gap-0 overflow-hidden rounded-sm border border-border/10 bg-(image:--background-gradient) p-0 text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-border/80">
                {filteringComponent && (
                    <div className="border-b border-border/60 bg-(image:--background-gradient) p-1 dark:border-border/80 sm:px-5 ">
                        {filteringComponent}
                    </div>
                )}

                <div
                    className="
                        relative w-full
                        overflow-x-auto
                    "
                >
                    <Table className="min-w-full">
                        {caption && (
                            <caption className="sr-only">
                                {caption}
                            </caption>
                        )}

                        <TableHeader
                            className="
                                bg-muted/35
                                dark:bg-muted/20
                            "
                        >
                            <TableRow
                                className="
                                    h-11 border-b
                                    border-border/70
                                    hover:bg-transparent
                                    dark:border-border/80
                                "
                            >
                                {columns.map(
                                    (
                                        column,
                                        index,
                                    ) => {
                                        const ColumnIcon =
                                            column.icon

                                        return (
                                            <TableHead
                                                key={`${String(
                                                    column.key,
                                                )}-${index}`}
                                                scope="col"
                                                className={`
                                                    h-11
                                                    whitespace-nowrap
                                                    px-4 py-0
                                                    text-[.8rem]
                                                    font-semibold
                                                    text-gray-900/70 dark:text-white/70
                                                    sm:px-5
                                                    ${column.className ??
                                                    ""
                                                    }
                                                `}
                                            >
                                                <div
                                                    className="
                                                        flex items-center
                                                        gap-1.5
                                                    "
                                                >
                                                    {ColumnIcon && (
                                                        <ColumnIcon
                                                            className="
                                                                size-3.5
                                                                shrink-0
                                                                opacity-70
                                                            "
                                                            aria-hidden="true"
                                                        />
                                                    )}

                                                    <span>
                                                        {
                                                            column.title
                                                        }
                                                    </span>
                                                </div>
                                            </TableHead>
                                        )
                                    },
                                )}

                                {actions && (
                                    <TableHead
                                        scope="col"
                                        className="
                                            h-11
                                            whitespace-nowrap
                                            px-4 py-0
                                            text-right
                                            text-[.8rem]
                                            font-semibold
                                            text-gray-900/70 dark:text-white/70
                                            sm:px-5
                                        "
                                    >
                                        Ações
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableLoadingRows
                                    columns={
                                        columns
                                    }
                                    hasActions={Boolean(
                                        actions,
                                    )}
                                />
                            ) : isError ? (
                                <TableStateRow
                                    colSpan={colSpan}
                                    icon={
                                        TriangleAlert
                                    }
                                    iconClassName="
                                        text-destructive
                                    "
                                    iconContainerClassName="
                                        bg-destructive/10
                                        ring-destructive/20
                                    "
                                    title="
                                        Não foi possível
                                        carregar os registros
                                    "
                                    description="
                                        Ocorreu um erro ao
                                        carregar os dados.
                                        Tente novamente.
                                    "
                                    action={
                                        onRetry ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={
                                                    onRetry
                                                }
                                                className="
                                                    h-9 gap-2
                                                    rounded-lg
                                                    px-4
                                                "
                                            >
                                                <RefreshCw
                                                    className="
                                                        size-4
                                                    "
                                                    aria-hidden="true"
                                                />

                                                Tentar
                                                novamente
                                            </Button>
                                        ) : undefined
                                    }
                                />
                            ) : data.length ===
                                0 ? (
                                <TableStateRow
                                    colSpan={
                                        colSpan
                                    }
                                    icon={FileText}
                                    iconClassName="
                                        text-muted-foreground
                                    "
                                    iconContainerClassName="
                                        bg-muted
                                        ring-border/70
                                    "
                                    title="
                                        Nenhum registro
                                        encontrado
                                    "
                                    description="
                                        Tente alterar os
                                        filtros ou cadastrar
                                        um novo item.
                                    "
                                />
                            ) : (
                                data.map(
                                    (
                                        row,
                                        rowIndex,
                                    ) => (
                                        <TableRow
                                            key={
                                                getRowKey?.(
                                                    row,
                                                    rowIndex,
                                                ) ??
                                                rowIndex
                                            }
                                            className="
                                                h-13.5
                                                border-b
                                                border-border/55
                                                transition-colors
                                                last:border-b-0
                                                hover:bg-muted/35
                                                dark:border-border/70
                                                dark:hover:bg-muted/20
                                            "
                                        >
                                            {columns.map(
                                                (
                                                    column,
                                                    columnIndex,
                                                ) => {
                                                    const value =
                                                        row[
                                                        column
                                                            .key
                                                        ]

                                                    return (
                                                        <TableCell
                                                            key={`${String(
                                                                column.key,
                                                            )}-${columnIndex}`}
                                                            className={`
                                                                whitespace-nowrap
                                                                px-4
                                                                py-2.5
                                                                align-middle
                                                                text-sm
                                                                text-foreground/90
                                                                sm:px-5
                                                                ${column.cellClassName ??
                                                                ""
                                                                }
                                                            `}
                                                        >
                                                            {column.render
                                                                ? column.render(
                                                                    value,
                                                                    row,
                                                                )
                                                                : String(
                                                                    value ??
                                                                    "",
                                                                )}
                                                        </TableCell>
                                                    )
                                                },
                                            )}

                                            {actions && (
                                                <TableCell
                                                    className="
                                                        whitespace-nowrap
                                                        px-4 py-2
                                                        text-right
                                                        align-middle
                                                        sm:px-5
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-end
                                                            gap-1
                                                        "
                                                    >
                                                        {actions(
                                                            row,
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ),
                                )
                            )}
                        </TableBody>

                        {pagination &&
                            !isLoading &&
                            !isError && (
                                <TablePaginationFooter
                                    pagination={
                                        pagination
                                    }
                                    pageTokens={
                                        pageTokens
                                    }
                                    colSpan={
                                        colSpan
                                    }
                                    firstItem={
                                        firstItem
                                    }
                                    lastItem={
                                        lastItem
                                    }
                                    registerName={
                                        registerName
                                    }
                                    onPageChange={
                                        handlePageChange
                                    }
                                />
                            )}
                    </Table>
                </div>
            </Card>
        </section>
    )
}

/* =========================================================
 * CARDS DE RESUMO
 * ======================================================= */

interface SummaryCardsProps {
    cardsQuantity: CardsQuantity
}

function SummaryCards({
    cardsQuantity,
}: SummaryCardsProps) {
    const cardsCount =
        cardsQuantity.summarys.length

    return (
        <div
            className="
                grid grid-cols-1 gap-3
                sm:grid-cols-2
                xl:grid-cols-[repeat(var(--cards),minmax(0,1fr))] 
            "
            style={
                {
                    "--cards": String(
                        cardsCount,
                    ),
                } as CSSProperties
            }
        >
            {cardsQuantity.summarys.map(
                (summary, index) => (
                    <CardQuantityComponent
                        key={`${summary.title}-${index}`}
                        summary={summary}
                        isLoading={
                            cardsQuantity.isLoading
                        }
                    />
                ),
            )}
        </div>
    )
}

/* =========================================================
 * LOADING DA TABELA
 * ======================================================= */

interface TableLoadingRowsProps<T> {
    columns: Column<T>[]
    hasActions: boolean
}

function TableLoadingRows<T>({
    columns,
    hasActions,
}: TableLoadingRowsProps<T>) {
    return (
        <>
            {Array.from({
                length: 8,
            }).map((_, rowIndex) => (
                <TableRow
                    key={`skeleton-${rowIndex}`}
                    className="
                        h-13.5
                        border-b
                        border-border/55
                        last:border-b-0
                        hover:bg-transparent
                        dark:border-border/70
                    "
                >
                    {columns.map(
                        (
                            column,
                            columnIndex,
                        ) => {
                            const skeletonWidth =
                                56 +
                                ((columnIndex *
                                    17 +
                                    rowIndex *
                                    7) %
                                    34)

                            return (
                                <TableCell
                                    key={`${String(
                                        column.key,
                                    )}-${columnIndex}`}
                                    className={`
                                        px-4 py-2.5
                                        align-middle
                                        sm:px-5
                                        ${column.cellClassName ??
                                        ""
                                        }
                                    `}
                                >
                                    <Skeleton
                                        className="
                                            h-4 rounded
                                        "
                                        style={{
                                            width: `${skeletonWidth}%`,
                                        }}
                                    />
                                </TableCell>
                            )
                        },
                    )}

                    {hasActions && (
                        <TableCell
                            className="
                                px-4 py-2
                                text-right
                                align-middle
                                sm:px-5
                            "
                        >
                            <div
                                className="
                                    ml-auto flex
                                    w-fit items-center
                                    gap-1
                                "
                            >
                                <Skeleton
                                    className="
                                        size-8
                                        rounded-md
                                    "
                                />

                                <Skeleton
                                    className="
                                        size-8
                                        rounded-md
                                    "
                                />
                            </div>
                        </TableCell>
                    )}
                </TableRow>
            ))}
        </>
    )
}

/* =========================================================
 * ESTADOS DE ERRO E VAZIO
 * ======================================================= */

interface TableStateRowProps {
    colSpan: number
    icon: LucideIcon
    iconClassName?: string
    iconContainerClassName?: string
    title: string
    description: string
    action?: ReactNode
}

function TableStateRow({
    colSpan,
    icon: StateIcon,
    iconClassName,
    iconContainerClassName,
    title,
    description,
    action,
}: TableStateRowProps) {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell
                colSpan={colSpan}
                className="h-70 p-0"
            >
                <div
                    className="
                        flex min-h-70
                        flex-col items-center
                        justify-center
                        px-6 py-12
                        text-center
                    "
                >
                    <span
                        className={`
                            flex size-14
                            items-center
                            justify-center
                            rounded-xl ring-1
                            ${iconContainerClassName ??
                            ""
                            }
                        `}
                    >
                        <StateIcon
                            className={`
                                size-6
                                ${iconClassName ??
                                ""
                                }
                            `}
                            aria-hidden="true"
                        />
                    </span>

                    <h3
                        className="
                            mt-4 text-sm
                            font-semibold
                            text-foreground
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1 max-w-sm
                            text-sm leading-5
                            text-muted-foreground
                        "
                    >
                        {description}
                    </p>

                    {action && (
                        <div className="mt-5">
                            {action}
                        </div>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}

/* =========================================================
 * PAGINAÇÃO
 * ======================================================= */

interface PaginationData {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

interface TablePaginationFooterProps {
    pagination: PaginationData
    pageTokens: PageToken[]
    colSpan: number
    firstItem: number
    lastItem: number
    registerName: string
    onPageChange: (page: number) => void
}

function TablePaginationFooter({
    pagination,
    pageTokens,
    colSpan,
    firstItem,
    lastItem,
    registerName,
    onPageChange,
}: TablePaginationFooterProps) {
    return (
        <TableFooter
            className="
                border-t
                border-border/70
                bg-card
                dark:border-border/80
            "
        >
            <TableRow
                className="
                    border-0
                    hover:bg-transparent
                "
            >
                <TableCell
                    colSpan={colSpan}
                    className="p-0"
                >
                    <div
                        className="
                            flex min-h-16
                            flex-col gap-3
                            px-4 py-3
                            sm:px-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >
                        <PaginationDescription
                            pagination={
                                pagination
                            }
                            firstItem={
                                firstItem
                            }
                            lastItem={
                                lastItem
                            }
                            registerName={
                                registerName
                            }
                        />

                        <Pagination
                            className="
                                mx-0 w-auto
                                justify-start
                                md:justify-end
                            "
                        >
                            <PaginationContent
                                className="
                                    flex-wrap gap-1
                                "
                            >
                                {/* Página anterior */}
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        aria-disabled={
                                            !pagination.hasPreviousPage
                                        }
                                        className={
                                            !pagination.hasPreviousPage
                                                ? "pointer-events-none opacity-50"
                                                : undefined
                                        }
                                        onClick={(
                                            event,
                                        ) => {
                                            event.preventDefault()

                                            if (
                                                pagination.hasPreviousPage
                                            ) {
                                                onPageChange(
                                                    pagination.page -
                                                    1,
                                                )
                                            }
                                        }}
                                    />
                                </PaginationItem>

                                {/* Páginas */}
                                {pageTokens.map(
                                    (
                                        token,
                                        index,
                                    ) => {
                                        if (
                                            token ===
                                            "ellipsis-left" ||
                                            token ===
                                            "ellipsis-right"
                                        ) {
                                            return (
                                                <PaginationItem
                                                    key={`${token}-${index}`}
                                                >
                                                    <PaginationEllipsis
                                                        className="
                                                            size-8
                                                            text-muted-foreground
                                                        "
                                                    />
                                                </PaginationItem>
                                            )
                                        }

                                        const isActive =
                                            token ===
                                            pagination.page

                                        return (
                                            <PaginationItem
                                                key={token}
                                            >
                                                <PaginationLink
                                                    href="#"
                                                    isActive={
                                                        isActive
                                                    }
                                                    onClick={(
                                                        event,
                                                    ) => {
                                                        event.preventDefault()

                                                        onPageChange(
                                                            token,
                                                        )
                                                    }}
                                                    className="
                                                        size-8
                                                        rounded-md
                                                    "
                                                    aria-label={`Ir para a página ${token}`}
                                                    aria-current={
                                                        isActive
                                                            ? "page"
                                                            : undefined
                                                    }
                                                >
                                                    {
                                                        token
                                                    }
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    },
                                )}

                                {/* Próxima página */}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        aria-disabled={
                                            !pagination.hasNextPage
                                        }
                                        className={
                                            !pagination.hasNextPage
                                                ? "pointer-events-none opacity-50"
                                                : undefined
                                        }
                                        onClick={(
                                            event,
                                        ) => {
                                            event.preventDefault()

                                            if (
                                                pagination.hasNextPage
                                            ) {
                                                onPageChange(
                                                    pagination.page +
                                                    1,
                                                )
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </TableCell>
            </TableRow>
        </TableFooter>
    )
}

interface PaginationDescriptionProps {
    pagination: PaginationData
    firstItem: number
    lastItem: number
    registerName: string
}

function PaginationDescription({
    pagination,
    firstItem,
    lastItem,
    registerName,
}: PaginationDescriptionProps) {
    return (
        <p
            className="
                text-xs
                text-muted-foreground
            "
            aria-live="polite"
        >
            {pagination.total > 0 ? (
                <>
                    Mostrando{" "}
                    <strong
                        className="
                            font-medium
                            text-foreground
                        "
                    >
                        {firstItem}
                    </strong>{" "}
                    a{" "}
                    <strong
                        className="
                            font-medium
                            text-foreground
                        "
                    >
                        {lastItem}
                    </strong>{" "}
                    de{" "}
                    <strong
                        className="
                            font-medium
                            text-foreground
                        "
                    >
                        {pagination.total}
                    </strong>{" "}
                    {registerName}
                </>
            ) : (
                <>Nenhum {registerName}</>
            )}
        </p>
    )
}

/* =========================================================
 * CARD DE QUANTIDADE
 * ======================================================= */

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

export function CardQuantityComponent({
    isLoading,
    summary,
}: CardQuantityComponentProps) {
    if (isLoading) {
        return (
            <Card
                className="
                    flex min-h-23
                    flex-row items-center
                    gap-3 rounded-xl
                    border border-border/70
                    bg-card px-4 py-3
                    shadow-sm
                    dark:border-border/80
                "
            >
                <Skeleton
                    className="
                        size-11 shrink-0
                        rounded-xl
                    "
                />

                <div
                    className="
                        flex min-w-0
                        flex-1 flex-col
                        gap-2
                    "
                >
                    <Skeleton
                        className="
                            h-6 w-16
                            rounded-md
                        "
                    />

                    <Skeleton
                        className="
                            h-3.5 w-28
                            rounded-md
                        "
                    />
                </div>
            </Card>
        )
    }

    const SummaryIcon =
        summary.icon

    return (
        <Card
            className={`
                group relative
                flex h-fit p-5
                flex-row items-center
                gap-3 overflow-hidden
                rounded-sm border-b border-border/10 bg-(image:--background-gradient)
                text-card-foreground
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-border
                hover:shadow-md
                ${summary.borderColor}
            `}
        >
            <div
                className={`
                    flex size-11
                    shrink-0 items-center
                    justify-center
                    rounded-sm
                    border border-current/10
                    bg-current/10
                    transition-transform
                    duration-200
                    group-hover:scale-105
                    ${summary.colorText}
                `}
            >
                <SummaryIcon
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </div>

            <div className="min-w-0">
                <strong
                    className="
                        block text-[22px]
                        font-bold leading-none
                        tracking-tight
                        text-foreground
                        tabular-nums
                    "
                >
                    {summary.value.toLocaleString(
                        "pt-BR",
                    )}
                </strong>

                <span
                    className="
                        mt-1.5 block
                        truncate text-xs
                        font-medium
                        text-muted-foreground
                    "
                    title={summary.title}
                >
                    {summary.title}
                </span>
            </div>
        </Card>
    )
}