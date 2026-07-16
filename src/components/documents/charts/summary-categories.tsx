interface SummaryCategoriesProps {
  categories: {
    category: string
    total: number
    fill: string
  }[]
}

export function SummaryCategories({
  categories,
}: SummaryCategoriesProps) {
  const totalDocuments = categories.reduce(
    (acc, item) => acc + item.total,
    0
  )

  return (
    <div className="col-span-2 flex w-full flex-col justify-center gap-3 pl-10">
      {categories.map((item) => {
        const percentage =
          totalDocuments === 0
            ? 0
            : (item.total / totalDocuments) * 100

        return (
          <div
            key={item.category}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />

              <span className="text-primary-text">
                {item.category}
              </span>
            </div>

            <div className="flex items-center gap-8">
              <span className="w-8 text-right font-medium text-primary-text">
                {item.total}
              </span>

              <span className="w-12 text-right text-muted-foreground">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}