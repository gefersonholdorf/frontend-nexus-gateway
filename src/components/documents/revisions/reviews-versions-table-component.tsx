import { TableComponent, type Column } from "@/components/table-component"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDate } from "date-fns"
import {
    CircleCheck,
    FileText,
    X
} from "lucide-react"

interface Version {
    id: number
    version: string
    changeLog: string | null
    createdAt: string
    createUser: {
        id: number
        name: string
        avatarUrl: string | null
        roleDescription: string | null
    },
    status:
    | "RASCUNHO"
    | "EM_APROVACAO"
    | "APROVADA"
    | "CANCELADA"
}

interface ReviewVersionsTableComponentProps {
    versions: Version[]
}

function getStatusBadge(status: Version["status"]) {
    switch (status) {
        case "RASCUNHO":
            return (
                <Badge
                    variant="outline"
                    className="border-blue-500/30 bg-blue-500/10 text-blue-500"
                >
                    Rascunho
                </Badge>
            )

        case "EM_APROVACAO":
            return (
                <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-500"
                >
                    Em Aprovação
                </Badge>
            )

        case "APROVADA":
            return (
                <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                >
                    Aprovada
                </Badge>
            )

        case "CANCELADA":
            return (
                <Badge
                    variant="outline"
                    className="border-red-500/30 bg-red-500/10 text-red-500"
                >
                    Cancelada
                </Badge>
            )

        default:
            return (
                <Badge variant="outline">
                    Desconhecido
                </Badge>
            )
    }
}

export function ReviewVersionsTableComponent({
    versions,
}: ReviewVersionsTableComponentProps) {
    const columns: Column<Version>[] = [
        {
            key: "version",
            title: "Versão",
            render: (_, row) => {
                return (
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                                {row.version}
                            </span>
                        </div>
                    </div>
                )
            },
        },

        {
            key: "status",
            title: "Status",
            render: (_, row) =>
                getStatusBadge(row.status),
        },

        {
            key: "id",
            title: "Alterações",
            render: (_, row) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="block truncate max-w-30 line-clamp-2 cursor-help">
                            {row.changeLog ||
                                "Nenhuma alteração informada"}
                        </span>
                    </TooltipTrigger>

                    <TooltipContent className="max-w-md">
                        <p>
                            {row.changeLog ||
                                "Nenhuma alteração informada"}
                        </p>
                    </TooltipContent>
                </Tooltip>
            ),
        },

        {
            key: "id",
            title: "Responsável",
            render: (_, row) => {
                const nameParts = row.createUser.name.split(" ")
                const firstName = nameParts[0]
                const lastName = nameParts.slice(1).join(" ")
                const initials = nameParts
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                return (
                    <div className="flex max-w-40 items-center gap-2 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage
                                src={row.createUser.avatarUrl ?? ""}
                                alt={row.createUser.name}
                            />
                            <AvatarFallback className="bg-primary text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col min-w-0">
                            <span className="truncate font-medium">
                                {firstName}
                            </span>

                            <span className="truncate text-muted-foreground text-xs">
                                {lastName}
                            </span>
                        </div>
                    </div>
                )
            }
        },

        {
            key: "createdAt",
            title: "Data",
            render: (_, row) => (
                <div className="flex flex-col text-sm">
                    <span>
                        {formatDate(
                            new Date(row.createdAt),
                            "dd/MM/yyyy"
                        )}
                    </span>

                    <span className="text-muted-foreground">
                        {formatDate(
                            new Date(row.createdAt),
                            "HH:mm"
                        )}
                    </span>
                </div>
            ),
        },

        {
            key: "id",
            title: "Ações",
            render: (_, row) => {
                if (row.status === "EM_APROVACAO"
                ) {
                    return (
                        <span className="text-muted-foreground text-sm">
                            —
                        </span>
                    )
                }

                return (
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="icon"
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            <CircleCheck className="h-4 w-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <TableComponent
            registerName="Versões"
            data={versions ?? []}
            columns={columns}
            isLoading={false}
            isError={false}
            onRetry={() => { }}
        />
    )
}