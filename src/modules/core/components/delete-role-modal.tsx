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

import { useDeleteRole } from "../hooks/use-delete-role";
import type { CoreRole } from "../mocks/roles.mock";

interface DeleteRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: CoreRole | null;
}

/**
 * Confirmação destrutiva de exclusão de role (RF013) via `AlertDialog`.
 */
export function DeleteRoleModal({ open, onOpenChange, role }: DeleteRoleModalProps) {
    const { mutate, isPending } = useDeleteRole();

    function handleConfirm() {
        if (!role) {
            return;
        }

        mutate(role.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="size-4 text-core-fail" aria-hidden="true" />
                        Excluir role
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {role ? (
                            <>
                                Tem certeza que deseja excluir <strong>{role.ds_name}</strong>? Esta
                                ação não pode ser desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja excluir esta role? Esta ação não pode ser desfeita."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={handleConfirm}
                        className="bg-core-fail text-white hover:bg-core-fail/90"
                    >
                        {isPending ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
