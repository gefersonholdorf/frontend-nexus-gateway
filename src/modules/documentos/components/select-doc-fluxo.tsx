import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useFetchDocFluxos } from "../hooks/use-fetch-doc-fluxos";

interface SelectDocFluxoProps {
    value: number | undefined;
    onValueChange: (value: number | undefined) => void;
    disabled?: boolean;
    id?: string;
}

const NONE_VALUE = "none";

/** Fluxo de aprovação é opcional (RF015) — inclui item "Nenhum". */
export function SelectDocFluxo({ value, onValueChange, disabled, id }: SelectDocFluxoProps) {
    const { data: fluxos, isLoading } = useFetchDocFluxos();

    const ativos = (fluxos ?? []).filter((fluxo) => fluxo.fl_ativo);

    return (
        <Select
            value={value ? String(value) : NONE_VALUE}
            onValueChange={(next) => onValueChange(next === NONE_VALUE ? undefined : Number(next))}
            disabled={disabled || isLoading}
        >
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={isLoading ? "Carregando..." : "Nenhum"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={NONE_VALUE}>Nenhum (aprovação direta)</SelectItem>
                {ativos.map((fluxo) => (
                    <SelectItem key={fluxo.cd_id} value={String(fluxo.cd_id)}>
                        {fluxo.ds_nome}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
