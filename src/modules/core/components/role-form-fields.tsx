import { type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { RoleFormValues } from "./role-form-schema";

interface RoleFormFieldsProps {
    register: UseFormRegister<RoleFormValues>;
    errors: FieldErrors<RoleFormValues>;
    control: Control<RoleFormValues>;
}

export function RoleFormFields({ register, errors }: RoleFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ds_name">Nome</Label>
                <Input id="ds_name" placeholder="Ex.: Administrador" {...register("ds_name")} />
                {errors.ds_name && (
                    <span className="text-sm text-destructive">{errors.ds_name.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_description">Descrição</Label>
                <Textarea
                    id="ds_description"
                    placeholder="Descreva o propósito desta role"
                    {...register("ds_description")}
                />
                {errors.ds_description && (
                    <span className="text-sm text-destructive">
                        {errors.ds_description.message}
                    </span>
                )}
            </div>
        </div>
    );
}
