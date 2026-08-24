import { CalendarClock, Clock, FileText, History, Eye, Download, ExternalLink, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { AvatarCircle, type Responsible } from "./responsibles-list"

// ---------- Tipos ----------

type DocumentStatus = "em-revisao" | "em-aprovacao" | "aprovado" | "vencendo" | "reprovado"

interface ResponsibleDocument {
    code: string
    description: string
    category: string
    version: string
    nextReview: string
    status: DocumentStatus
}

interface ResponsibleDetails {
    unit: string
    lastAccess: string
    documents: ResponsibleDocument[]
}

// ---------- Mock determinístico (trocar pela API depois) ----------

const UNITS = ["Governança & Riscos", "Segurança da Informação", "Compliance", "Auditoria Interna", "Qualidade"]
const LAST_ACCESS = ["Hoje, 09:42", "Hoje, 08:15", "Ontem, 16:20", "Ontem, 11:03", "12/08/2026"]
const DOC_TEMPLATES: Array<Omit<ResponsibleDocument, "version" | "nextReview" | "status">> = [
    { code: "PRO-008", description: "Procedimento de Gestão de Incidentes", category: "Procedimento" },
    { code: "POL-002", description: "Política de Segurança da Informação", category: "Política" },
    { code: "MAN-001", description: "Manual do SGSI", category: "Manual" },
    { code: "IT-014", description: "Instrução de Trabalho - Backup", category: "Instrução de Trabalho" },
    { code: "FOR-021", description: "Formulário de Análise de Riscos", category: "Formulário" },
    { code: "PRO-012", description: "Procedimento de Controle de Acesso", category: "Procedimento" },
]
const STATUSES: DocumentStatus[] = ["em-revisao", "aprovado", "vencendo", "em-aprovacao", "reprovado"]

function hashString(value: string) {
    let hash = 0
    for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0
    return Math.abs(hash)
}

function mockDetailsFor(person: Responsible): ResponsibleDetails {
    const seed = hashString(String(person.id ?? person.name))
    const documents = Array.from({ length: 1 + (seed % 5) }, (_, i) => {
        const template = DOC_TEMPLATES[(seed + i) % DOC_TEMPLATES.length]
        return {
            ...template,
            version: `1.${(seed + i) % 9}`,
            nextReview: new Date(2026, (seed + i) % 12, 1 + ((seed + i * 7) % 27)).toLocaleDateString("pt-BR"),
            status: STATUSES[(seed + i) % STATUSES.length],
        }
    })

    return {
        unit: UNITS[seed % UNITS.length],
        lastAccess: LAST_ACCESS[seed % LAST_ACCESS.length],
        documents,
    }
}

const STATUS_CONFIG: Record<DocumentStatus, { label: string; className: string }> = {
    "em-revisao": {
        label: "Em Revisão",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    },
    "em-aprovacao": {
        label: "Em Aprovação",
        className: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
    },
    aprovado: {
        label: "Aprovado",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    vencendo: {
        label: "Vencendo",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    },
    reprovado: {
        label: "Reprovado",
        className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    },
}

// ---------- Componente ----------

export function ResponsibleProfilePanel({ responsible }: { responsible: Responsible }) {
    const details = mockDetailsFor(responsible)

    const stats = [
        {
            label: "Sob responsabilidade",
            value: details.documents.length,
            icon: FileText,
            className: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
        },
        {
            label: "Vencendo",
            value: details.documents.filter((d) => d.status === "vencendo").length,
            icon: CalendarClock,
            className: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        },
        {
            label: "Em aprovação",
            value: details.documents.filter((d) => d.status === "em-aprovacao").length,
            icon: Clock,
            className: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
        },
        {
            label: "Reprovados",
            value: details.documents.filter((d) => d.status === "reprovado").length,
            icon: XCircle,
            className: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
        },
    ]

    return (
        <div className="space-y-6">
            {/* Cabeçalho do perfil */}
            <section className="flex flex-wrap items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <AvatarCircle name={responsible.name} avatarUrl={responsible.avatarUrl} size="lg" />

                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {responsible.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{responsible.role}</p>
                    <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                        Responsável ativo
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="border-l border-slate-200 pl-8 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Unidade</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{details.unit}</p>
                    </div>
                    <div className="border-l border-slate-200 pl-8 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Último acesso</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{details.lastAccess}</p>
                    </div>
                </div>
            </section>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                    >
                        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", stat.className)}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Documentos */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <header className="flex items-center justify-between px-6 py-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Documentos deste responsável
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {details.documents.length} registro(s)
                    </span>
                </header>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead>
                            <tr className="border-t border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                <th className="px-6 py-3 font-medium">Documento</th>
                                <th className="px-4 py-3 font-medium">Categoria</th>
                                <th className="px-4 py-3 font-medium">Versão</th>
                                <th className="px-4 py-3 font-medium">Próxima Revisão</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 text-right font-medium">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.documents.map((doc) => {
                                const status = STATUS_CONFIG[doc.status]
                                return (
                                    <tr
                                        key={doc.code}
                                        className="border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{doc.code}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{doc.description}</p>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{doc.category}</td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{doc.version}</td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{doc.nextReview}</td>
                                        <td className="px-4 py-4">
                                            <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-medium", status.className)}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {[Eye, History, Download, ExternalLink].map((Icon, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500/60 dark:hover:text-blue-400"
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}