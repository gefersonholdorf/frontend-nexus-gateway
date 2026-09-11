import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateDocFluxo } from "../hooks/use-update-doc-fluxo";
import type { DocFluxo } from "../hooks/use-fetch-doc-fluxos";
import { FluxoEtapasBuilder } from "./fluxo-etapas-builder";
import { fluxoFormSchema, type FluxoFormValues } from "./fluxo-form-schema";

interface EditFluxoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fluxo: DocFluxo | null;
}

function toFormValues(fluxo: DocFluxo | null): FluxoFormValues {
    return {
        ds_nome: fluxo?.ds_nome ?? "",
        ds_descricao: fluxo?.ds_descricao ?? "",
        etapas:
            [...(fluxo?.etapas ?? [])]
                .sort((a, b) => a.ds_ordem - b.ds_ordem)
                .map((etapa) => ({
                    ds_nome: etapa.ds_nome,
                    aprovadores: etapa.aprovadores.map((aprovador) => aprovador.cd_id),
                })) ?? [],
    };
}

/**
 * `PUT /documentos/fluxos/:id` (RF024) — substitui etapas/aprovadores por
 * completo (transacional no backend).
 */
export function EditFluxoModal({ open, onOpenChange, fluxo }: EditFluxoModalProps) {
    const { mutateAsync, isPending } = useUpdateDocFluxo();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FluxoFormValues>({
        resolver: zodResolver(fluxoFormSchema),
        defaultValues: toFormValues(fluxo),
    });

    useEffect(() => {
        if (open) {
            reset(toFormValues(fluxo));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, fluxo]);

    async function onSubmit(values: FluxoFormValues) {
        if (!fluxo) {
            return;
        }

        await mutateAsync({
            cd_id: fluxo.cd_id,
            ds_nome: values.ds_nome,
            ds_descricao: values.ds_descricao,
            etapas: values.etapas.map((etapa, index) => ({
                ds_nome: etapa.ds_nome,
                ds_ordem: index + 1,
                aprovadores: etapa.aprovadores,
            })),
        });

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Editar fluxo de aprovação</DialogTitle>
                    <DialogDescription>
                        Atenção: salvar substitui todas as etapas e aprovadores deste fluxo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
                        <div className="space-y-2">
                            <Label htmlFor="ds_nome">Nome</Label>
                            <Input id="ds_nome" placeholder="Ex.: Fluxo SGSI" {...register("ds_nome")} />
                            {errors.ds_nome && (
                                <span className="text-sm text-destructive">{errors.ds_nome.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ds_descricao">Descrição</Label>
                            <Textarea
                                id="ds_descricao"
                                placeholder="Descreva o propósito deste fluxo"
                                {...register("ds_descricao")}
                            />
                        </div>

                        <FluxoEtapasBuilder control={control} register={register} errors={errors} />
                    </div>

                    <DialogFooter className="border-t p-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Save className="size-4" />
                            {isPending ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
