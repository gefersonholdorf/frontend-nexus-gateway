import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useApproveRevisao } from "../hooks/use-approve-revisao";

interface ApproveRevisaoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentoId: number;
    revisaoId: number;
    /** Documento sem fluxo de aprovação: aprovar já publica (RF016, Cenário 6). */
    requiresUrlPublicacao: boolean;
}

function buildSchema(requiresUrl: boolean) {
    return z.object({
        ds_url_publicacao: z
            .string()
            .trim()
            .min(
                requiresUrl ? 1 : 0,
                "Informe a URL de publicação para concluir a aprovação.",
            ),
    });
}

type FormValues = { ds_url_publicacao: string };

/**
 * `POST /documentos/:id/revisoes/:revisaoId/aprovar` (RF014). Sem fluxo de
 * aprovação, a aprovação da revisão já publica o documento (RF016) e exige a
 * URL de publicação (Cenário 6).
 */
export function ApproveRevisaoDialog({
    open,
    onOpenChange,
    documentoId,
    revisaoId,
    requiresUrlPublicacao,
}: ApproveRevisaoDialogProps) {
    const { mutateAsync, isPending } = useApproveRevisao(documentoId);
    const schema = buildSchema(requiresUrlPublicacao);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ds_url_publicacao: "" },
    });

    async function onSubmit(values: FormValues) {
        await mutateAsync({
            revisaoId,
            ds_url_publicacao: values.ds_url_publicacao || undefined,
        });
        reset();
        onOpenChange(false);
    }

    function handleOpenChange(next: boolean) {
        if (!next) {
            reset();
        }
        onOpenChange(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                        Aprovar revisão
                    </DialogTitle>
                    <DialogDescription>
                        {requiresUrlPublicacao
                            ? "Este documento não possui fluxo de aprovação — aprovar a revisão publica o documento imediatamente."
                            : "Este documento possui fluxo de aprovação — aprovar a revisão inicia o fluxo pela primeira etapa (RF017)."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {requiresUrlPublicacao && (
                        <div className="space-y-2">
                            <Label htmlFor="ds_url_publicacao">URL de publicação</Label>
                            <Input
                                id="ds_url_publicacao"
                                placeholder="https://..."
                                {...register("ds_url_publicacao")}
                            />
                            {errors.ds_url_publicacao && (
                                <span className="text-sm text-destructive">
                                    {errors.ds_url_publicacao.message}
                                </span>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enviando..." : "Aprovar revisão"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
