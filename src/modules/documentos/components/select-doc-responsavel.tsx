import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useGetUsuariosSelect } from "../hooks/use-get-usuarios-select";

interface SelectDocResponsavelProps {
    value: number | undefined;
    onValueChange: (value: number) => void;
    disabled?: boolean;
    id?: string;
}

export function SelectDocResponsavel({
    value,
    onValueChange,
    disabled,
    id,
}: SelectDocResponsavelProps) {
    const { data: usuarios, isLoading } = useGetUsuariosSelect();

    return (
        <Select
            value={value ? String(value) : undefined}
            onValueChange={(next) => onValueChange(Number(next))}
            disabled={disabled || isLoading}
        >
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o responsável"} />
            </SelectTrigger>
            <SelectContent>
                {(usuarios ?? []).map((usuario) => (
                    <SelectItem key={usuario.cd_id} value={String(usuario.cd_id)}>
                        {usuario.ds_name} ({usuario.ds_email})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
