import { CircleCheck, CircleX, CloudUpload, Database } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function BackupOverviewComponent() {
    const totalBackups = 80
    return (
        <Card
            className="
                h-55 rounded-3xl
                border-slate-200
                shadow-sm
                transition-all duration-300
                transform hover:scale-[1.01]
                hover:shadow-lg
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
            <CardContent className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-4 border-r border-slate-200 pr-4 justify-center">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 border border-blue-500 rounded-full overflow-hidden flex items-center justify-center bg-blue-50">
                            <Database className="text-blue-500 size-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-2xl">10</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[.8rem] text-slate-500">Total Executado</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 justify-center border-r border-slate-200 pr-4">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 border border-emerald-500 rounded-full overflow-hidden flex items-center justify-center bg-emerald-50">
                            <CircleCheck className="text-emerald-500 size-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-2xl">8</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 justify-center">
                        <span className="text font-semibold text-emerald-500">80%</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 justify-center">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 border border-red-500 rounded-full overflow-hidden flex items-center justify-center bg-red-50">
                            <CircleX className="text-red-500 size-4" />
                        </div>
                        <span className="font-bold text-slate-900 text-2xl">2</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 justify-center">
                        <span className="text font-semibold text-red-500">20%</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-red-400 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all bg-emerald-500`}
                                style={{
                                    width: `${Math.min(totalBackups, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}