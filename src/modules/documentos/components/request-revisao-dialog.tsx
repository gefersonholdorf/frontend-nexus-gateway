import { FileClock } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRequestRevisao } from "../hooks/use-request-revisao";

interface RequestRevisaoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentoId: number;
}

/**
 * Confirmação de abertura de revisão manual (RF007). O backend bloqueia com
 * 409 se já houver revisão aberta (Cenário 2) — mensagem exibida via toast
 * pelo próprio hook.
 */
export function RequestRevisaoDialog({ open, onOpenChange, documentoId }: RequestRevisaoDialogProps) {
    const { mutate, isPending } = useRequestRevisao(documentoId);

    function handleConfirm() {
        mutate(undefined, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <FileClock className="size-4 text-primary" aria-hidden="true" />
                        Solicitar revisão
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        O documento passará para o status Em Revisão e você poderá criar novas
                        versões dentro desta revisão.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
                        {isPending ? "Abrindo..." : "Abrir revisão"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
