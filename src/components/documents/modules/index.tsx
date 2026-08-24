import { useTheme } from "@/contexts/theme-context"
import {
    FileText,
    FilePlus,
    GitPullRequest,
    LayoutDashboard,
    CalendarClock,
    User,
    Settings,
    type LucideIcon
} from "lucide-react"
import { useLocation, useNavigate } from "react-router"

interface DocumentModule {
    id: number
    title: string
    icon: LucideIcon
    url: string
}

const documentsModules: DocumentModule[] = [
    { id: 1, title: "Documentos", icon: FileText, url: "documents" },
    { id: 2, title: "Cadastrar Documento", icon: FilePlus, url: "documents/create" },
    { id: 5, title: "Gestão de Revisões", icon: CalendarClock, url: "documents/reviews" },
    { id: 3, title: "Gestão de Aprovações", icon: GitPullRequest, url: "approval" },
    { id: 7, title: "Responsabilidades", icon: User, url: "documents/profiles" },
    { id: 4, title: "Dashboard", icon: LayoutDashboard, url: "dashboard-sgsi" },
    { id: 8, title: "Configuração", icon: Settings, url: "documents/configurations" },
]

export function DocumentsModulesComponent() {
    const navigate = useNavigate()
    const location = useLocation()
    const { theme } = useTheme()

    const isActive = (moduleUrl: string) => {
        const currentPath = location.pathname.replace(/^\/+/, "")
        return currentPath === moduleUrl
    }

    return (
        <nav className=" border-b border-border">
            <div className="max-w-7xl">
                <ul className="flex items-start gap-1">
                    {documentsModules.map((module) => {
                        const Icon = module.icon
                        const active = isActive(module.url)

                        return (
                            <li key={module.id}>
                                <span
                                    onClick={() => navigate(`/${module.url}`)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                                        transition-colors duration-200 cursor-pointer
                                        ${active
                                            ? "text-sky-500 border-b-2 border-sky-400"
                                            : `${theme === 'dark' ? 'text-[#A7B4D0]' : 'text-[#5E6A7D]'} hover:text-sky-400 hover:bg-background`
                                        }
                                    `}
                                >
                                    <Icon size={18} strokeWidth={1.5} />
                                    <span>{module.title}</span>
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
}