import { ArrowRight, CloudUpload } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { BackupGaugeChart } from "./backup-chart";

export function BackupOverviewComponent() {
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
            <CardContent className="flex flex-col gap-4pb-4">
                <BackupGaugeChart />
                <div className=" pt-4">
                    <button
                        className="
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            bg-slate-100
                                                            py-3
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            transition-all
                                                            hover:bg-slate-200
                                                        "
                    >
                        Ver Backups
                        <ArrowRight size={16} />
                    </button>
                </div>
            </CardContent>
        </Card >
    )
}