import { BackComponent } from "@/components/back-component";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppWindow, Expand, Minimize, Search } from "lucide-react";
import { useState } from "react";
import { SystemGrid } from "@/components/system-grid";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";

export function SystemsPage() {
    const [fullDetails, setFullDetails] = useState(false)
    const [filtering, setFiltering] = useState("")
    const [typeFiltering, setTypeFiltering] = useState<'homolog' | 'production' | 'todos'>("todos")
    const { theme } = useTheme()

    function toggleDetails() {
        console.log("Toggle details")
        setFullDetails((prev) => !prev)
    }

    function handleFilterChange(value: string) {
        setFiltering(value)
    }

    function handleTypeFiltering(type: 'homolog' | 'production' | 'todos') {
        setTypeFiltering(type)
    }

    return (
        <div
            className={cn(
                "flex flex-col min-h-screen justify-between",
                theme === "clean" && "bg-[url('/5570869.jpg')] bg-cover bg-center",
                theme === "dark" && "bg-background"
            )}
        >
            <div className="px-10 flex justify-between items-center border-b border-border bg-background p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-border rounded-md overflow-hidden flex items-center justify-center bg-background/20">
                        <AppWindow className="text-primary-text size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Sistemas</h1>
                        <p className="text-primary-text text-[.8rem]">Visualize e acesse todos os sistemas da Lusati Tecnologia.</p>
                    </div>
                </div>
                <Tooltip>
                    <TooltipTrigger>
                        {fullDetails ? (
                            <Minimize onClick={toggleDetails} className="size-6 hover:text-blue-500 cursor-pointer" />
                        ) : (
                            <Expand onClick={toggleDetails} className="size-5 hover:text-blue-500 cursor-pointer" />
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        {fullDetails ? (
                            <p>Minimizar</p>
                        ) : (
                            <p>Expandir</p>
                        )}
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="bg-background px-10 py-4 grid grid-cols-1 lg:grid-cols-9 gap-2">
                <div className="relative flex items-center col-span-6">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />

                    <Input
                        className="pl-10"
                        placeholder="Buscar sistema..."
                        onChange={(e) => handleFilterChange(e.target.value)}
                    />
                </div>
                <div
                    onClick={() => handleTypeFiltering('todos')}
                    className={`col-span-1 border rounded-sm flex items-center justify-center hover:border-blue-900 transition-all duration-300 ease-in-out
                            cursor-pointer ${typeFiltering === 'todos' ? 'bg-blue-900 text-primary-text' : 'bg-background text-gray-900'}`}
                >
                    <span className="font-bold text-[.8rem]">Todos</span>
                </div>
                <div
                    onClick={() => handleTypeFiltering('production')}
                    className={`col-span-1 border rounded-sm flex items-center justify-center hover:border-blue-900 transition-all duration-300 ease-in-out
                            cursor-pointer ${typeFiltering === 'production' ? 'bg-blue-900 text-primary-text' : 'bg-background text-gray-900'}`}
                >
                    <span className="font-bold text-[.8rem]">Produção</span>
                </div>
                <div
                    onClick={() => handleTypeFiltering('homolog')}
                    className={`col-span-1 border rounded-sm flex items-center justify-center hover:border-blue-900 transition-all duration-300 ease-in-out
                            cursor-pointer ${typeFiltering === 'homolog' ? 'bg-blue-900 text-primary-text' : 'bg-background text-gray-900'}`}
                >
                    <span className="font-bold text-[.8rem]">Homologação</span>
                </div>
            </div>
            <div className="flex-1 py-4">
                <SystemGrid fullDetails={fullDetails} filtering={filtering} typeFiltering={typeFiltering} />
            </div>
        </div >
    )
}