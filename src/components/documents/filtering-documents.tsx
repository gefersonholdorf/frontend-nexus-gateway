import { useState, useEffect } from "react";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export const filtersSchema = z.object({
    text: z.string(),
    category: z.string(),
    status: z.string(),
    department: z.string(),
});

export type Filters = z.infer<typeof filtersSchema>;

interface FilteringDocumentsProps {
    onFilterChange?: (filters: Filters) => void;
}

export function FilteringDocuments({
    onFilterChange,
}: FilteringDocumentsProps) {
    const [filters, setFilters] = useState<Filters>({
        text: "",
        category: "",
        status: "",
        department: "",
    });

    const [searchText, setSearchText] = useState("");

    const debouncedSearch = useDebounce(searchText, 700);

    useEffect(() => {
        updateFilter("text", debouncedSearch || "");
    }, [debouncedSearch]);

    function updateFilter<K extends keyof Filters>(
        key: K,
        value: Filters[K]
    ) {
        const newFilters = {
            ...filters,
            [key]: value,
        };

        setFilters(newFilters);
        onFilterChange?.(newFilters);
    }

    function clearFilters() {
        setSearchText("");

        const newFilters: Filters = {
            text: "",
            category: "",
            status: "",
            department: "",
        };

        setFilters(newFilters);
        onFilterChange?.(newFilters);
    }

    return (
        <Card
            className="h-fit rounded-sm p-4 space-y-1 border-none border-transparent shadow-sm
      transition-all duration-300 hover:shadow-sm
      bg-(image:--background-gradient)"
        >
            <div className="flex flex-col gap-2">
                <span className="text-[.8rem]">Filtrar por:</span>

                <div className="w-full grid grid-cols-1 lg:grid-cols-7 gap-4">
                    <div className="col-span-3">
                        <Input
                            placeholder="Buscar por código ou título..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <Select
                        value={filters.category}
                        onValueChange={(value) =>
                            updateFilter("category", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Politica">
                                    Política
                                </SelectItem>
                                <SelectItem value="Procedimento">
                                    Procedimento
                                </SelectItem>
                                <SelectItem value="Manual">
                                    Manual
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status}
                        onValueChange={(value) =>
                            updateFilter("status", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Vigente">
                                    Vigente
                                </SelectItem>
                                <SelectItem value="Em Andamento">
                                    Em Andamento
                                </SelectItem>
                                <SelectItem value="Em Revisao">
                                    Em Revisão
                                </SelectItem>
                                <SelectItem value="Pendente">
                                    Pendente
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.department}
                        onValueChange={(value) =>
                            updateFilter("department", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Departamento" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="RH">RH</SelectItem>
                                <SelectItem value="Infra">Infra</SelectItem>
                                <SelectItem value="Suporte">
                                    Suporte
                                </SelectItem>
                                <SelectItem value="Desenvolvimento">
                                    Desenvolvimento
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

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