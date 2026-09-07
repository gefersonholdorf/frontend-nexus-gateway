import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { IntegrationFormValues } from "./integration-form-schema";

interface IntegrationFormFieldsProps {
    register: UseFormRegister<IntegrationFormValues>;
    errors: FieldErrors<IntegrationFormValues>;
    configKeys: string[];
}

/**
 * Campos de edição da integração (RF026). `ds_config` é renderizado
 * dinamicamente a partir das chaves presentes no mock (RF027) — as chaves
 * variam por integração, então nunca há campo hardcoded por tipo aqui.
 */
export function IntegrationFormFields({ register, errors, configKeys }: IntegrationFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ds_name">Nome</Label>
                <Input id="ds_name" placeholder="Ex.: Jira Software" {...register("ds_name")} />
                {errors.ds_name && (
                    <span className="text-sm text-destructive">{errors.ds_name.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_description">Descrição</Label>
                <Textarea
                    id="ds_description"
                    placeholder="Descreva o propósito desta integração"
                    {...register("ds_description")}
                />
                {errors.ds_description && (
                    <span className="text-sm text-destructive">
                        {errors.ds_description.message}
                    </span>
                )}
            </div>

            {configKeys.length > 0 && (
                <div className="space-y-3 rounded-md border border-border/60 p-3">
                    <p className="text-xs font-medium text-muted-foreground">Configuração</p>

                    {configKeys.map((key) => {
                        const fieldError = errors.ds_config?.[key];

                        return (
                            <div key={key} className="space-y-1.5">
                                <Label htmlFor={`ds_config.${key}`} className="capitalize">
                                    {key}
                                </Label>
                                <Input
                                    id={`ds_config.${key}`}
                                    className="font-mono text-xs"
                                    {...register(`ds_config.${key}` as const)}
                                />
                                {fieldError && (
                                    <span className="text-sm text-destructive">
                                        {fieldError.message}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
