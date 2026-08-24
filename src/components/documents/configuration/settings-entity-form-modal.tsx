import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type {
    SettingsEntity,
    SettingsEntityKind,
} from "@/types/documents/settings";

const buildSchema = (kind: SettingsEntityKind) =>
    z.object({
        name: z
            .string()
            .min(2, "O nome deve ter no mínimo 2 caracteres.")
            .max(80, "O nome deve ter no máximo 80 caracteres."),
        description: z.string().max(240, "Máximo de 240 caracteres.").optional(),
        active: z.boolean(),
        months:
            kind === "periodicity"
                ? z.coerce
                    .number({ message: "Informe o intervalo em meses." })
                    .int("Use um número inteiro.")
                    .min(1, "Mínimo de 1 mês.")
                    .max(120, "Máximo de 120 meses.")
                : z.coerce.number().optional(),
    });

interface SettingsEntityFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kind: SettingsEntityKind;
    entity?: (SettingsEntity & { months?: number }) | null;
    title: string;
}

export function SettingsEntityFormModal({
    open,
    onOpenChange,
    kind,
    entity,
    title,
}: SettingsEntityFormModalProps) {
    const schema = buildSchema(kind);
    type FormValues = z.infer<typeof schema>;

    // const saveMutation = useSaveSettingsEntity(kind);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            active: true,
            months: undefined,
        },
    });

    // Preenche o form ao editar / limpa ao criar
    useEffect(() => {
        if (open) {
            form.reset({
                name: entity?.name ?? "",
                description: entity?.description ?? "",
                active: entity?.active ?? true,
                months: entity?.months,
            });
        }
    }, [open, entity, form]);

    // async function onSubmit(values: FormValues) {
    //     const payload: SettingsEntityPayload = {
    //         name: values.name,
    //         description: values.description ?? null,
    //         active: values.active,
    //         ...(kind === "periodicity" ? { months: values.months } : {}),
    //     };

    //     try {
    //         await saveMutation.mutateAsync({ id: entity?.id, payload });
    //         onOpenChange(false);
    //     } catch (error) {
    //         // Feedback ao usuário segue o padrão de toast do projeto
    //         console.error("Erro ao salvar configuração:", error);
    //     }
    // }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo para {entity ? "editar" : "cadastrar"} o
                        registro.
                    </DialogDescription>
                </DialogHeader>
                {/* onSubmit={form.handleSubmit(onSubmit)} */}
                <form id="settings-entity-form" >
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ex.: Política"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="description">Descrição</FieldLabel>
                                    <Input
                                        {...field}
                                        id="description"
                                        value={field.value ?? ""}
                                        placeholder="Descrição opcional"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {kind === "periodicity" && (
                            <Controller
                                name="months"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="months">Intervalo (meses)</FieldLabel>
                                        <Input
                                            {...field}
                                            id="months"
                                            type="number"
                                            min={1}
                                            value={field.value ?? ""}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ex.: 12"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        )}

                        <Controller
                            name="active"
                            control={form.control}
                            render={({ field }) => (
                                <Field orientation="horizontal">
                                    <Switch
                                        id="active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor="active">Ativo</FieldLabel>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="settings-entity-form"
                    // disabled={saveMutation.isPending}
                    >
                        {/* {saveMutation.isPending ? "Salvando..." : "Salvar"} */}Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}