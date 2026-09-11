import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
    Controller,
    useFieldArray,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DocUsuariosCheckboxGroup } from "./doc-usuarios-checkbox-group";
import type { FluxoFormValues } from "./fluxo-form-schema";

interface FluxoEtapasBuilderProps {
    control: Control<FluxoFormValues>;
    register: UseFormRegister<FluxoFormValues>;
    errors: FieldErrors<FluxoFormValues>;
}

/**
 * Builder de etapas + aprovadores do fluxo (RF024). Etapas são sequenciais
 * (RN015) — a ordem exibida na lista é a ordem enviada ao backend
 * (`ds_ordem` calculado a partir do índice no submit).
 */
export function FluxoEtapasBuilder({ control, register, errors }: FluxoEtapasBuilderProps) {
    const { fields, append, remove } = useFieldArray({ control, name: "etapas" });

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Etapas (sequenciais)</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ ds_nome: "", aprovadores: [] })}
                >
                    <Plus className="size-3.5" />
                    Adicionar etapa
                </Button>
            </div>

            {errors.etapas?.root?.message && (
                <span className="text-sm text-destructive">{errors.etapas.root.message}</span>
            )}
            {errors.etapas?.message && (
                <span className="text-sm text-destructive">{errors.etapas.message}</span>
            )}

            {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma etapa adicionada.</p>
            )}

            <div className="space-y-4">
                {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="space-y-3 rounded-md border border-border/60 p-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <GripVertical className="size-3.5" aria-hidden="true" />
                                Etapa {index + 1}
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 text-destructive hover:text-destructive"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`etapas.${index}.ds_nome`}>Nome da etapa</Label>
                            <Input
                                id={`etapas.${index}.ds_nome`}
                                placeholder="Ex.: Comitê SGSI"
                                {...register(`etapas.${index}.ds_nome` as const)}
                            />
                            {errors.etapas?.[index]?.ds_nome && (
                                <span className="text-sm text-destructive">
                                    {errors.etapas[index]?.ds_nome?.message}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Aprovadores</Label>
                            <Controller
                                control={control}
                                name={`etapas.${index}.aprovadores` as const}
                                render={({ field }) => (
                                    <DocUsuariosCheckboxGroup value={field.value} onChange={field.onChange} />
                                )}
                            />
                            {errors.etapas?.[index]?.aprovadores && (
                                <span className="text-sm text-destructive">
                                    {errors.etapas[index]?.aprovadores?.message}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
