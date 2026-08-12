import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const filtersSchema = z.object({
    text: z.string(),
    monthYear: z.string(),
    status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED','INACTIVE', 'all'])
});

export type Filters = z.infer<typeof filtersSchema>;
export type CampaignFilterStatus = Filters["status"];

interface FilteringDocumentsProps {
    onFilterChange?: (filters: Filters) => void;
}

export function FilteringCampaigns({
    onFilterChange,
}: FilteringDocumentsProps) {
    const [filters, setFilters] = useState<Filters>({
        text: "",
        monthYear: "",
        status: "all",
    });

    const [searchText, setSearchText] = useState("");
    const [searchMonthYear, setSearchMonthYear] = useState("");

    const debouncedSearch = useDebounce(searchText, 700);
    const debouncedSearchMonthYear = useDebounce(searchMonthYear, 700);

    useEffect(() => {
        updateFilter("text", debouncedSearch || "");
        updateFilter("monthYear", debouncedSearchMonthYear || "");
    }, [debouncedSearch, debouncedSearchMonthYear]);

    function updateFilter<K extends keyof Filters>(
        key: K,
        value: Filters[K]
    ) {
        setFilters(prev => {
            const next = {
                ...prev,
                [key]: value,
            };

            onFilterChange?.(next);
            return next;
        });
    }

    function clearFilters() {
        setSearchText("");
        setSearchMonthYear("")
        const newFilters: Filters = {
            text: "",
            status: "all",
            monthYear: ""
        };

        setFilters(newFilters);
        onFilterChange?.(newFilters);
    }

    function handleStatusChange(value: string) {
    if (
        value === "DRAFT" ||
        value === "SCHEDULED" ||
        value === "PUBLISHED" ||
        value === "INACTIVE" ||
        value === "all"
    ) {
        updateFilter("status", value);
    }
}

    return (
        <Card
            className="h-fit rounded-t-sm rounded-b-none p-4 space-y-1 border-none border-transparent shadow-sm
      transition-all duration-300 hover:shadow-sm
      bg-(image:--background-gradient)"
        >
            <div className="flex flex-col gap-2">
                <div className="w-full grid grid-cols-1 lg:grid-cols-7 gap-4">
                    <div className="col-span-3">
                        <div className="space-y-1">
                            <Label className="text-[.8rem] text-muted-foreground">Filtrar por</Label>
                            <Input
                                placeholder="Buscar por código ou título..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="space-y-1">
                            <Label className="text-[.8rem] text-muted-foreground">Filtrar por</Label>
                            <Input
                                placeholder="Buscar por mês/ano..."
                                value={searchMonthYear}
                                onChange={(e) => setSearchMonthYear(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[.8rem] text-muted-foreground">Status:</Label>
                        <Select
                            value={filters.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    Todos
                                </SelectItem>
                                <SelectItem value="DRAFT">
                                    Rascunho
                                </SelectItem>

                                <SelectItem value="SCHEDULED">
                                    Agendada
                                </SelectItem>

                                <SelectItem value="PUBLISHED">
                                    Publicado
                                </SelectItem>

                                <SelectItem value="INACTIVE">
                                    Encerrada
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 rounded-sm hover:bg-card
            text-muted-foreground hover:text-red-500
            border border-transparent hover:border-border
            text-[.8rem] flex items-center justify-center
            cursor-pointer gap-2"
                    >
                        <X className="size-4" />
                        <span>Limpar Filtros</span>
                    </button>
                </div>
            </div>
        </Card>
    );
}