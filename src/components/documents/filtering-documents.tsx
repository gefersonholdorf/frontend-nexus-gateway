import {
    Select,
    SelectContent,
    SelectGroup,
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
import { SelectProfiles } from "../forms/select-profiles";
import { useGetProfilesSelect } from "@/api/profiles/get-select-profiles";
import { useUser } from "@/contexts/user-context";

export const filtersSchema = z.object({
    text: z.string(),
    category: z.string(),
    status: z.string(),
    profile: z.string(),
});

export type Filters = z.infer<typeof filtersSchema>;

interface FilteringDocumentsProps {
    onFilterChange?: (filters: Filters) => void;
}

export function FilteringDocuments({
    onFilterChange,
}: FilteringDocumentsProps) {
    const { user } = useUser()
    const { data, isLoading } = useGetProfilesSelect()
    const isAdmin = user?.roles.includes("Administrador");
    const [filters, setFilters] = useState<Filters>({
        text: "",
        category: "all",
        status: "all",
        profile: "all",
    });

    useEffect(() => {
        if (!data) return;

        if (isAdmin) {
            updateFilter("profile", "all");
            return;
        }

        const profile = data.profiles.find(p =>
            user?.roles.includes(p.name)
        );

        if (profile) {
            updateFilter("profile", String(profile.id));
        }
    }, [data, isAdmin]);

    const [searchText, setSearchText] = useState("");

    const debouncedSearch = useDebounce(searchText, 700);

    useEffect(() => {
        updateFilter("text", debouncedSearch || "");
    }, [debouncedSearch]);

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
        let profile = "all"

        const profiles = data!.profiles.find(p =>
            user?.roles.includes(p.name)
        );

        if (profiles) {
            if(isAdmin) {
                profile = "all"
            } else {
                profile = String(profiles.id)
            }
        }

        const newFilters: Filters = {
            text: "",
            category: "all",
            status: "all",
            profile,
        };

        setFilters(newFilters);
        onFilterChange?.(newFilters);
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

                    <div className="space-y-1">
                        <Label className="text-[.8rem] text-muted-foreground">Tipo:</Label>
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
                                    <SelectItem value="all">
                                        Todos
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[.8rem] text-muted-foreground">Status:</Label>
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
                                    <SelectItem value="Em Revisão">
                                        Em Revisão
                                    </SelectItem>
                                    <SelectItem value="Pendente">
                                        Pendente
                                    </SelectItem>
                                    <SelectItem value="all">
                                        Todos
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[.8rem] text-muted-foreground">Responsável:</Label>
                        {!isLoading && (
                            <SelectProfiles value={filters.profile} onChange={(value) => updateFilter("profile", value)} profiles={data!.profiles} />
                        )}
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