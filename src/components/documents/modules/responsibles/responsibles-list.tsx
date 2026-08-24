import { ChevronRight, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Responsible {
    id: string | number
    name: string
    role?: string
    avatarUrl?: string | null
    subtitle?: string
}

interface DocumentsResponsiblesListProps {
    responsibles: Responsible[]
    selectedId?: string | number
    onSelect: (id: string | number) => void
    isLoading?: boolean
}

export function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    const first = parts[0]?.[0] ?? ""
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
    return (first + last).toUpperCase()
}

export function AvatarCircle({
    name,
    avatarUrl,
    size = "md",
}: {
    name: string
    avatarUrl?: string | null
    size?: "md" | "lg"
}) {
    const sizeClass = size === "lg" ? "h-20 w-20 text-2xl" : "h-11 w-11 text-sm"

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                className={cn(sizeClass, "shrink-0 rounded-full object-cover")}
            />
        )
    }

    return (
        <div
            className={cn(
                sizeClass,
                "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
                "bg-gradient-to-br from-sky-400 to-blue-600"
            )}
        >
            {getInitials(name)}
        </div>
    )
}

export function DocumentsResponsiblesList({
    responsibles,
    selectedId,
    onSelect,
    isLoading,
}: DocumentsResponsiblesListProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <header className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Lista de responsáveis
                </h2>
            </header>

            <div className="max-h-[560px] space-y-2 overflow-y-auto p-3">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl p-3">
                            <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-2.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    ))
                ) : responsibles.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                        <Users className="h-8 w-8" />
                        <p className="text-sm">Nenhum responsável encontrado.</p>
                    </div>
                ) : (
                    responsibles.map((person) => {
                        const isSelected = person.id === selectedId

                        return (
                            <button
                                key={person.id}
                                type="button"
                                onClick={() => onSelect(person.id)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                                    isSelected
                                        ? "border-blue-500 bg-blue-50 dark:border-blue-500/70 dark:bg-blue-500/10"
                                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <AvatarCircle name={person.name} avatarUrl={person.avatarUrl} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {person.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        {person.role}
                                    </p>
                                </div>
                                <ChevronRight
                                    className={cn(
                                        "h-4 w-4 shrink-0",
                                        isSelected
                                            ? "text-blue-500 dark:text-blue-400"
                                            : "text-slate-400 dark:text-slate-500"
                                    )}
                                />
                            </button>
                        )
                    })
                )}
            </div>
        </section>
    )
}