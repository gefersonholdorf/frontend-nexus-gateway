import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LucideIcon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
}

export function TableComponent<T>({
  data,
  columns,
  caption,
  actions,
}: TableComponentProps<T>) {
  return (
    <Card className="h-fit flex-row rounded-sm p-4 border-none border-transparent shadow-sm transition-all duration-300 transform hover:scale-[1.00]
                                    hover:shadow-sm outline-none bg-(image:--background-gradient)">
      <Table className="bg-(image:--background-gradient) rounded-lg p-12 shadow-sm">
        {caption && <TableCaption>{caption}</TableCaption>}

        <TableHeader>
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
              <TableHead className={`text-right px-6 py-4`}>
                Ações
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
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
                <TableCell className={`px-6 py-2 text-right`}>
                  {actions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <div className="pl-4">
                <span className="text-[.8rem] text-muted-foreground">10 de 10 documentos</span>
              </div>
            </TableCell>
            <TableCell colSpan={999}>
              <Pagination className="bg-(image:--background-gradient) flex justify-end rounded-lg flex-1 px-6 py-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
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