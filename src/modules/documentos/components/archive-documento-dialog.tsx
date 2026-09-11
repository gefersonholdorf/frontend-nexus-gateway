import { Archive } from "lucide-react";

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

import { useArchiveDocumento } from "../hooks/use-archive-documento";
import type { DocumentoListItem } from "../hooks/use-fetch-documentos";

interface ArchiveDocumentoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documento: DocumentoListItem | null;
}

/**
 * Confirmação de arquivamento (RF022) — terminal nesta entrega, sem
 * reativação.
 */
export function ArchiveDocumentoDialog({ open, onOpenChange, documento }: ArchiveDocumentoDialogProps) {
    const { mutate, isPending } = useArchiveDocumento();

    function handleConfirm() {
        if (!documento) {
            return;
        }

        mutate(documento.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Archive className="size-4 text-destructive" aria-hidden="true" />
                        Arquivar documento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {documento ? (
                            <>
                                Tem certeza que deseja arquivar <strong>{documento.ds_titulo}</strong>?
                                O documento sairá das listagens de ativos e esta ação não pode ser
                                desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja arquivar este documento? Esta ação não pode ser desfeita."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={handleConfirm}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isPending ? "Arquivando..." : "Arquivar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
