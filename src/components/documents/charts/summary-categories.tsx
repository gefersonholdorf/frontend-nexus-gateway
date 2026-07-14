
export function SummaryCategories() {
    const summary = [
        {
            title: "Procedimento",
            count: 15,
            percentage: 25 * 100,
            bgColor: "bg-amber-400"
        },
        {
            title: "Manual",
            count: 5,
            percentage: 5 * 100,
            bgColor: "bg-blue-500"
        },
        {
            title: "Política",
            count: 10,
            percentage: 10 * 100,
            bgColor: "bg-rose-400"
        }
    ]
    return (
        <div className="col-span-2 pl-10 w-full flex flex-col justify-center gap-3">
            {summary.map((item) => (
                <div
                    key={item.title}
                    className="w-full flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-sm ${item.bgColor}`}
                        />

                        <span className="text-primary-text">
                            {item.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-8">
                        <span className="text-primary-text font-medium w-8 text-right">
                            {item.count}
                        </span>

                        <span className="text-muted-foreground w-12 text-right">
                            {item.percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}