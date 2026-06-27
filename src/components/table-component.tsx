import {
  Pagination,
  PaginationContent,
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
  TableRow
} from "@/components/ui/table"
import { Cog, FileText, type LucideIcon } from "lucide-react"
import { Card } from "./ui/card"

export type Column<T> = {
  key: keyof T
  title: string
  className?: string
  cellClassName?: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  icon?: LucideIcon
}

export interface TableComponentProps<T> {
  data: T[]
  columns: Column<T>[]
  caption?: string
  actions?: (row: T) => React.ReactNode
  pagination: {
    page: number,
    perPage: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
  }
  onPageChange?: (page: number) => void
}

export function TableComponent<T>({
  data,
  columns,
  actions,
  pagination,
  onPageChange
}: TableComponentProps<T>) {
  const pages = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1
  )
  return (
    <Card className="h-fit flex-row rounded-sm p-0 border-none border-transparent shadow-sm transition-all duration-300 transform hover:scale-[1.00]
                                    hover:shadow-sm outline-none bg-(image:--background-gradient)">
      <Table className="bg-(image:--background-gradient) rounded-lg p-12 shadow-sm">
        <TableHeader className="bg-card">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={`px-6 py-4 ${column.className ?? ""}`}
              >
                <div className="flex items-center gap-2">
                  {column.icon && <column.icon className="size-4" />}
                  {column.title}
                </div>
              </TableHead>
            ))}
            {actions && (
              <TableHead className={`text-right px-6 py-4 `}>
                <div className="flex items-center justify-end gap-1 text-right">
                  <Cog className="size-4" />
                  Ações
                </div>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-40 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <FileText className="size-8 text-muted-foreground" />
                  <span className="font-medium">
                    Nenhum documento encontrado
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Tente alterar os filtros ou cadastrar um novo documento.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={`px-6 py-4 ${column.cellClassName ?? ""}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? "")}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell className="px-6 py-2 text-right">
                    {actions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className="bg-card">
          <TableRow>
            <TableCell colSpan={2}>
              <div className="pl-4">
                <span className="text-[.8rem] text-muted-foreground">{data.length} de {pagination.total} documentos</span>
              </div>
            </TableCell>
            <TableCell colSpan={999}>
              <Pagination className="bg-transparent flex justify-end rounded-lg flex-1 px-6 py-0">
                <PaginationContent>

                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()

                        if (pagination.hasPreviousPage) {
                          onPageChange?.(pagination.page - 1)
                        }
                      }}
                    />
                  </PaginationItem>

                  {pages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === pagination.page}
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange?.(page)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
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
      </Table>
    </Card>
  )
}