import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useGetUsuariosSelect } from "../hooks/use-get-usuarios-select";

interface DocUsuariosCheckboxGroupProps {
    value: number[];
    onChange: (value: number[]) => void;
    disabled?: boolean;
}

/**
 * Aprovadores de uma etapa do fluxo (N-N, RF015/RN016). Mesmo padrão de
 * checklist usado para roles do documento — sem combobox genérico no repo.
 */
export function DocUsuariosCheckboxGroup({ value, onChange, disabled }: DocUsuariosCheckboxGroupProps) {
    const { data: usuarios, isLoading } = useGetUsuariosSelect();

    function handleToggle(userId: number, checked: boolean) {
        if (checked) {
            onChange([...value, userId]);
        } else {
            onChange(value.filter((id) => id !== userId));
        }
    }

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Carregando usuários...</p>;
    }

    if (!usuarios || usuarios.length === 0) {
        return <p className="text-sm text-muted-foreground">Nenhum usuário disponível.</p>;
    }

    return (
        <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto rounded-md border border-border/60 p-3 sm:grid-cols-2">
            {usuarios.map((usuario) => (
                <Label
                    key={usuario.cd_id}
                    className="flex items-center gap-2 text-sm font-normal"
                    htmlFor={`doc-usuario-${usuario.cd_id}`}
                >
                    <Checkbox
                        id={`doc-usuario-${usuario.cd_id}`}
                        checked={value.includes(usuario.cd_id)}
                        disabled={disabled}
                        onCheckedChange={(checked) => handleToggle(usuario.cd_id, Boolean(checked))}
                    />
                    {usuario.ds_name}
                </Label>
            ))}
        </div>
    );
}
