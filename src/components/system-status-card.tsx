import { Card } from "./ui/card";

interface SystemStatusCardProps {
    serverName: string
}

export function SystemStatusCard({ serverName }: SystemStatusCardProps) {
    return (
        <Card className="rounded-2xl border border-slate-200 px-4 py-4 shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
            hover:shadow-sm">
            <div className="flex justify-between items-center">
                <span className="font-normal text-sm text-gray-600">Cluster</span>
                <span className="font-bold text-sm text-gray-600">{serverName}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-normal text-sm text-gray-600">Status</span>
                <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-gray-600 text-sm">Online</span>
                </div>
            </div>
        </Card >
    )
}