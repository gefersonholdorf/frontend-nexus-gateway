import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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

import { useCreateDocFluxo } from "../hooks/use-create-doc-fluxo";
import { FluxoEtapasBuilder } from "./fluxo-etapas-builder";
import { fluxoFormSchema, type FluxoFormValues } from "./fluxo-form-schema";

interface CreateFluxoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: FluxoFormValues = { ds_nome: "", ds_descricao: "", etapas: [] };

/** `POST /documentos/fluxos` (RF024). */
export function CreateFluxoModal({ open, onOpenChange }: CreateFluxoModalProps) {
    const { mutateAsync, isPending } = useCreateDocFluxo();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FluxoFormValues>({
        resolver: zodResolver(fluxoFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: FluxoFormValues) {
        await mutateAsync({
            ds_nome: values.ds_nome,
            ds_descricao: values.ds_descricao,
            etapas: values.etapas.map((etapa, index) => ({
                ds_nome: etapa.ds_nome,
                ds_ordem: index + 1,
                aprovadores: etapa.aprovadores,
            })),
        });

        reset(DEFAULT_VALUES);
        onOpenChange(false);
    }

    function handleOpenChange(next: boolean) {
        if (!next) {
            reset(DEFAULT_VALUES);
        }
        onOpenChange(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Novo fluxo de aprovação</DialogTitle>
                    <DialogDescription>
                        Etapas sequenciais (RN015); aprovadores da mesma etapa atuam em paralelo
                        (RN016).
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
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Plus className="size-4" />
                            {isPending ? "Salvando..." : "Criar fluxo"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
