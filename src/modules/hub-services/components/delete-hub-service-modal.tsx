import { Trash2 } from "lucide-react";

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

import { useDeleteHubService } from "../hooks/use-delete-hub-service";
import type { HubService } from "../hooks/use-fetch-hub-services";

interface DeleteHubServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hubService: HubService | null;
}

/**
 * Confirmação destrutiva de exclusão (RF004/RN008) via `AlertDialog` —
 * `useDeleteHubService` chama `DELETE /hub-services/{id}`.
 */
export function DeleteHubServiceModal({ open, onOpenChange, hubService }: DeleteHubServiceModalProps) {
    const { mutate, isPending } = useDeleteHubService();

    function handleConfirm() {
        if (!hubService) {
            return;
        }

        mutate(hubService.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        Excluir sistema/serviço
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {hubService ? (
                            <>
                                Tem certeza que deseja excluir <strong>{hubService.ds_title}</strong>?
                                Esta ação não pode ser desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
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
                        {isPending ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
