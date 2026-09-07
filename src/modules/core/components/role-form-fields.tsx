import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { RoleFormValues } from "./role-form-schema";

interface RoleFormFieldsProps {
    register: UseFormRegister<RoleFormValues>;
    errors: FieldErrors<RoleFormValues>;
    control: Control<RoleFormValues>;
}

export function RoleFormFields({ register, errors, control }: RoleFormFieldsProps) {
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

            <div className="space-y-2">
                <Label htmlFor="fl_active">Status</Label>
                <Controller
                    control={control}
                    name="fl_active"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="fl_active" className="w-full">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Ativo</SelectItem>
                                <SelectItem value="false">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.fl_active && (
                    <span className="text-sm text-destructive">{errors.fl_active.message}</span>
                )}
            </div>
        </div>
    );
}
