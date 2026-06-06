import { CircleCheck, CircleX, CloudUpload } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { BackupGaugeChart } from "./backup-chart";

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
                h-116 rounded-3xl
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
            <CardContent className="flex gap-4 border-b border-slate-200 pb-4">
                <BackupGaugeChart />
            </CardContent>
            <CardFooter className="flex flex-col justify-start items-start pt-0 px-0">
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