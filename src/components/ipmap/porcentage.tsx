export function Porcentage({ percentage, quantityUsed, quantityTotal }: { percentage: number; quantityUsed: number; quantityTotal: number }) {
    return (
        <div
            className="
                border bg-background p-4 rounded-xl border-zinc-300 shadow-sm
                w-full transition-all duration-300 transform hover:scale-[1.01]
            "
        >
            <div className="flex gap-4 w-full justify-between items-center mb-3">
                <p className="text-[.8rem] text-primary-text italic">
                    Utilização de IPs na Rede
                </p>

                <p className="font-bold text-[.8rem] text-zinc-700">
                    {percentage}%
                </p>
            </div>

            <div className="h-3 w-full rounded-lg bg-zinc-200 overflow-hidden">
                <div
                    className="
                        h-full rounded-lg transition-all duration-500
                        bg-linear-to-r from-amber-500 to-amber-400
                    "
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex items-center gap-4 mt-2">
                <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-[.8rem] text-primary-text">Em uso ({quantityUsed} IPs)</span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                    <span className="text-[.8rem] text-primary-text">Livre ({quantityTotal - quantityUsed} IPs)</span>
                </div>
            </div>
        </div>
    )
}