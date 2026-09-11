import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useFetchDocAreas } from "../hooks/use-fetch-doc-areas";

interface SelectDocAreaProps {
    value: number | undefined;
    onValueChange: (value: number) => void;
    disabled?: boolean;
    id?: string;
}

export function SelectDocArea({ value, onValueChange, disabled, id }: SelectDocAreaProps) {
    const { data: areas, isLoading } = useFetchDocAreas();

    const ativas = (areas ?? []).filter((area) => area.fl_ativo);

    return (
        <Select
            value={value ? String(value) : undefined}
            onValueChange={(next) => onValueChange(Number(next))}
            disabled={disabled || isLoading}
        >
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione a área"} />
            </SelectTrigger>
            <SelectContent>
                {ativas.map((area) => (
                    <SelectItem key={area.cd_id} value={String(area.cd_id)}>
                        {area.ds_nome} ({area.ds_sigla})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
