import { Card } from "@/components/ui/card";
import { useState } from "react";
import { z } from "zod";

export const filtersSchema = z.object({
    type: z.enum(["assignedMe", "all", "applicantMe"]),
});

export type Filters = z.infer<typeof filtersSchema>;

interface FilteringReviewsProps {
    onFilterChange?: (filters: Filters) => void;
}

export function FilteringReviews({
    onFilterChange,
}: FilteringReviewsProps) {
    const [filters, setFilters] = useState<Filters>({
        type: "all"
    });

    function handleSetFilters({ type }: Filters) {
        setFilters({ type })
    }

    return (
        <Card
            className="h-fit rounded-t-sm rounded-b-none pt-4 px-4 pb-0 space-y-1 border-none border-transparent shadow-sm
      transition-all duration-300 hover:shadow-sm
      bg-(image:--background-gradient)"
        >
            <div className="flex items-center gap-6 text-sm font-medium whitespace-nowrap text-muted-foreground">
                <div
                    onClick={() => handleSetFilters({ type: "all" })}
                    className={`border-b-3 ${filters.type === 'all' ? "border-b-3 border-primary text-primary" : "text-muted-foreground border-transparent"} px-2 pb-2 cursor-pointer hover:text-primary hover:border-primary`}>
                    <span>Todas</span>
                </div>
                <div
                    onClick={() => handleSetFilters({ type: "assignedMe" })}
                    className={`border-b-3${filters.type === 'assignedMe' ? "border-primary text-primary" : "text-muted-foreground border-transparent"} px-2 pb-2 cursor-pointer hover:text-primary hover:border-primary`}>
                    <span>Atribuidas a mim</span>
                </div>
                <div
                    onClick={() => handleSetFilters({ type: "applicantMe" })}
                    className={`border-b-3${filters.type === 'applicantMe' ? "border-primary text-primary" : "text-muted-foreground border-transparent"} px-2 pb-2 cursor-pointer hover:text-primary hover:border-primary`}>
                    <span>Solicitadas por mim</span>
                </div>
            </div>
        </Card>
    );
}