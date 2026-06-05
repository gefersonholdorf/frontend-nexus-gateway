import { CircleCheck, CircleX, CloudUpload } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface Backup {
    id: string
    name: string
    date: Date
    status: 'success' | 'failed'
    size: string
}

const backups: Backup[] = [
    {
        id: "1",
        name: "Backup 1",
        date: new Date(),
        status: "success",
        size: "100 MB"
    },
    {
        id: "2",
        name: "Backup 2",
        date: new Date(),
        status: "failed",
        size: "200 MB"
    },
    {
        id: "3",
        name: "Backup 3",
        date: new Date(),
        status: "success",
        size: "150 MB"
    },
    {
        id: "4",
        name: "Backup 4",
        date: new Date(),
        status: "success",
        size: "120 MB"
    },
    {
        id: "5",
        name: "Backup 4",
        date: new Date(),
        status: "success",
        size: "120 MB"
    },
    {
        id: "6",
        name: "Backup 4",
        date: new Date(),
        status: "success",
        size: "120 MB"
    },
    {
        id: "7",
        name: "Backup 4",
        date: new Date(),
        status: "success",
        size: "120 MB"
    }
]

export function BackupOverviewComponent() {
    const totalBackups = 80
    return (
        <Card
            className="
                h-100 rounded-3xl
                border-slate-200
                shadow-sm
                transition-all duration-300
                transform hover:scale-[1.01]
                hover:shadow-lg space-y-1 gap-2
            "
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-blue-900 rounded-md overflow-hidden flex items-center justify-center bg-blue-900">
                        <CloudUpload className="text-white size-5" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Backups de Hoje
                        </h3>
                        <p className="text-xs text-slate-500">
                            Visão geral dos backups executados hoje
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                <div className="flex flex-col items-center gap-2 border-r border-slate-200 pr-4 justify-center">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-10 h-10 border border-blue-500 rounded-full overflow-hidden flex items-center justify-center bg-blue-50">
                            <span className="font-bold text-blue-900 text-lg">10</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-[.7rem] text-slate-500">Total Executado</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 justify-center border-r border-slate-200 pr-4">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-10 h-10 border border-emerald-500 rounded-full overflow-hidden flex items-center justify-center bg-emerald-50">
                            <span className="font-bold text-emerald-900 text-lg">8</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 justify-center">
                        <span className="text-[.9rem] font-semibold text-emerald-500">80%</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 justify-center">
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-10 h-10 border border-red-500 rounded-full overflow-hidden flex items-center justify-center bg-red-50">
                            <span className="font-bold text-red-900 text-lg">2</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 justify-center">
                        <span className="text-[.9rem] font-semibold text-red-500">20%</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-start items-start pt-0 px-0">
                <div className="w-full flex items-center justify-between gap-2 mb-2 px-2">
                    <span className="text-[.7rem] text-slate-500 ml-1">Taxa de sucesso</span>
                    <span className="text-[.7rem] text-emerald-500 ml-1">80%</span>
                </div>
                <div className="w-full px-2">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all bg-linear-to-r from-emerald-400 to-emerald-600`}
                                style={{
                                    width: `${Math.min(totalBackups, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <ScrollArea className="w-full h-50 mt-2">
                    {backups.map((backups) => (
                        <div key={backups.id} className="flex items-center justify-between px-4 py-2 border-b last:border-b-0">
                            <div className="flex items-center gap-3">
                                {backups.status === 'success' ? (
                                    <CircleCheck className="text-emerald-500 size-4" />
                                ) : (
                                    <CircleX className="text-red-500 size-4" />
                                )}
                                <span className="text-[.8rem] font-medium text-slate-700">{backups.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[.7rem] text-slate-500">{backups.size} -</span>
                                <span className="text-[.7rem] text-slate-500">{backups.date.toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardFooter>
        </Card >
    )
}