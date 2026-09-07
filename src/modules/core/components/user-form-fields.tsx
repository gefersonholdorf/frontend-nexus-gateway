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

import type { UserFormValues } from "./user-form-schema";

interface UserFormFieldsProps {
    register: UseFormRegister<UserFormValues>;
    errors: FieldErrors<UserFormValues>;
    control: Control<UserFormValues>;
}

export function UserFormFields({ register, errors, control }: UserFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ds_name">Nome</Label>
                <Input id="ds_name" placeholder="Nome completo" {...register("ds_name")} />
                {errors.ds_name && (
                    <span className="text-sm text-destructive">{errors.ds_name.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_email">E-mail</Label>
                <Input
                    id="ds_email"
                    type="email"
                    placeholder="nome@nexus.com"
                    {...register("ds_email")}
                />
                {errors.ds_email && (
                    <span className="text-sm text-destructive">{errors.ds_email.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_role_description">Cargo</Label>
                <Input
                    id="ds_role_description"
                    placeholder="Ex.: Analista de Suporte"
                    {...register("ds_role_description")}
                />
                {errors.ds_role_description && (
                    <span className="text-sm text-destructive">
                        {errors.ds_role_description.message}
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
