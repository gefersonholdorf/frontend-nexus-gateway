import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useFetchDocCategorias } from "../hooks/use-fetch-doc-categorias";

interface SelectDocCategoriaProps {
    value: number | undefined;
    onValueChange: (value: number) => void;
    disabled?: boolean;
    id?: string;
}

/**
 * Select de referência (categoria) — padrão "lista pequena e completa"
 * (`select-profiles.tsx`): hook busca tudo de uma vez, sem busca assíncrona.
 */
export function SelectDocCategoria({ value, onValueChange, disabled, id }: SelectDocCategoriaProps) {
    const { data: categorias, isLoading } = useFetchDocCategorias();

    const ativas = (categorias ?? []).filter((categoria) => categoria.fl_ativo);

    return (
        <Select
            value={value ? String(value) : undefined}
            onValueChange={(next) => onValueChange(Number(next))}
            disabled={disabled || isLoading}
        >
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione a categoria"} />
            </SelectTrigger>
            <SelectContent>
                {ativas.map((categoria) => (
                    <SelectItem key={categoria.cd_id} value={String(categoria.cd_id)}>
                        {categoria.ds_nome} ({categoria.ds_sigla})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
