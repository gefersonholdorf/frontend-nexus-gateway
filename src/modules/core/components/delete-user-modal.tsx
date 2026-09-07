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

import { useDeleteUser } from "../hooks/use-delete-user";
import type { CoreUser } from "../hooks/use-fetch-users";

interface DeleteUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: CoreUser | null;
}

/**
 * Confirmação destrutiva de exclusão de usuário (RF011) via `AlertDialog` —
 * `useDeleteUser` chama `DELETE /users/{id}`.
 */
export function DeleteUserModal({ open, onOpenChange, user }: DeleteUserModalProps) {
    const { mutate, isPending } = useDeleteUser();

    function handleConfirm() {
        if (!user) {
            return;
        }

        mutate(user.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="size-4 text-core-fail" aria-hidden="true" />
                        Excluir usuário
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {user ? (
                            <>
                                Tem certeza que deseja excluir <strong>{user.ds_name}</strong>? Esta
                                ação não pode ser desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
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
