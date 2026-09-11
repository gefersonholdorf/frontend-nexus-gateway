import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useRejectRevisao } from "../hooks/use-reject-revisao";

const schema = z.object({
    // RN024/Cenário 5: justificativa é sempre obrigatória em reprovação.
    ds_justificativa: z.string().trim().min(1, "Informe a justificativa para prosseguir."),
});

type FormValues = z.infer<typeof schema>;

interface RejectRevisaoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentoId: number;
    revisaoId: number;
}

/** `POST /documentos/:id/revisoes/:revisaoId/negar` (RF014, Cenário 3). */
export function RejectRevisaoDialog({
    open,
    onOpenChange,
    documentoId,
    revisaoId,
}: RejectRevisaoDialogProps) {
    const { mutateAsync, isPending } = useRejectRevisao(documentoId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ds_justificativa: "" },
    });

    async function onSubmit(values: FormValues) {
        await mutateAsync({ revisaoId, ds_justificativa: values.ds_justificativa });
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
                        <XCircle className="size-4 text-destructive" aria-hidden="true" />
                        Negar revisão
                    </DialogTitle>
                    <DialogDescription>
                        A revisão e todas as suas versões serão reprovadas; a versão vigente
                        permanece a última aprovada (RN012).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ds_justificativa">Justificativa</Label>
                        <Textarea
                            id="ds_justificativa"
                            placeholder="Descreva o motivo da reprovação"
                            {...register("ds_justificativa")}
                        />
                        {errors.ds_justificativa && (
                            <span className="text-sm text-destructive">
                                {errors.ds_justificativa.message}
                            </span>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? "Enviando..." : "Negar revisão"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
