import { UserX } from "lucide-react";

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

import { useToggleUserStatus } from "../hooks/use-toggle-user-status";
import type { CoreUser } from "../mocks/users.mock";

interface InactiveUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: CoreUser | null;
}

/**
 * Confirmação destrutiva de inativação de usuário (RF008) via `AlertDialog`.
 * Reativar não passa por este modal — é uma ação direta na tabela (não é
 * destrutiva).
 */
export function InactiveUserModal({ open, onOpenChange, user }: InactiveUserModalProps) {
    const { mutate, isPending } = useToggleUserStatus();

    function handleConfirm() {
        if (!user) {
            return;
        }

        mutate(
            { cd_id: user.cd_id, fl_active: false },
            { onSettled: () => onOpenChange(false) },
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <UserX className="size-4 text-core-neutral" aria-hidden="true" />
                        Inativar usuário
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {user ? (
                            <>
                                Tem certeza que deseja inativar <strong>{user.ds_name}</strong>? O
                                usuário perderá acesso ao sistema até ser reativado.
                            </>
                        ) : (
                            "Tem certeza que deseja inativar este usuário?"
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
                        {isPending ? "Inativando..." : "Inativar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
