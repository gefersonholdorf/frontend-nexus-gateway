import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useGetRolesSelect } from "../hooks/use-get-roles-select";

interface DocRolesCheckboxGroupProps {
    value: number[];
    onChange: (value: number[]) => void;
    disabled?: boolean;
}

/**
 * Roles associadas ao documento (RF003, N-N). Não há combobox multi-select
 * genérico no repo — segue o mesmo padrão de checklist já usado em
 * `user-roles-drawer.tsx` (Core) para vínculo N-N com lista pequena.
 */
export function DocRolesCheckboxGroup({ value, onChange, disabled }: DocRolesCheckboxGroupProps) {
    const { data: roles, isLoading } = useGetRolesSelect();

    function handleToggle(roleId: number, checked: boolean) {
        if (checked) {
            onChange([...value, roleId]);
        } else {
            onChange(value.filter((id) => id !== roleId));
        }
    }

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Carregando roles...</p>;
    }

    if (!roles || roles.length === 0) {
        return <p className="text-sm text-muted-foreground">Nenhuma role disponível.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-2 rounded-md border border-border/60 p-3 sm:grid-cols-2">
            {roles.map((role) => (
                <Label
                    key={role.cd_id}
                    className="flex items-center gap-2 text-sm font-normal"
                    htmlFor={`doc-role-${role.cd_id}`}
                >
                    <Checkbox
                        id={`doc-role-${role.cd_id}`}
                        checked={value.includes(role.cd_id)}
                        disabled={disabled}
                        onCheckedChange={(checked) => handleToggle(role.cd_id, Boolean(checked))}
                    />
                    {role.ds_name}
                </Label>
            ))}
        </div>
    );
}
