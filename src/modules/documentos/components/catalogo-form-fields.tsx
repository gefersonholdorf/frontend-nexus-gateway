import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import type { CatalogoFormValues } from "./catalogo-form-schema";

interface CatalogoFormFieldsProps {
    register: UseFormRegister<CatalogoFormValues>;
    errors: FieldErrors<CatalogoFormValues>;
    control: Control<CatalogoFormValues>;
    siglaPlaceholder?: string;
}

export function CatalogoFormFields({
    register,
    errors,
    control,
    siglaPlaceholder,
}: CatalogoFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ds_nome">Nome</Label>
                <Input id="ds_nome" placeholder="Ex.: Segurança da Informação" {...register("ds_nome")} />
                {errors.ds_nome && (
                    <span className="text-sm text-destructive">{errors.ds_nome.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_sigla">Sigla</Label>
                <Input
                    id="ds_sigla"
                    placeholder={siglaPlaceholder ?? "Ex.: SGSI"}
                    className="uppercase"
                    {...register("ds_sigla")}
                />
                {errors.ds_sigla && (
                    <span className="text-sm text-destructive">{errors.ds_sigla.message}</span>
                )}
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
                <div>
                    <p className="text-sm font-medium text-foreground">Ativo</p>
                    <p className="text-xs text-muted-foreground">
                        Itens inativos deixam de aparecer nos selects de novos documentos.
                    </p>
                </div>
                <Controller
                    control={control}
                    name="fl_ativo"
                    render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                />
            </div>
        </div>
    );
}
