import { ShieldOff } from "lucide-react";

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

import { useToggleRoleStatus } from "../hooks/use-toggle-role-status";
import type { CoreRole } from "../hooks/use-fetch-roles";

interface InactiveRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: CoreRole | null;
}

/**
 * Confirmação destrutiva de inativação de role (RF013) via `AlertDialog`.
 * Reativar não passa por este modal — é uma ação direta na tabela (não é
 * destrutiva).
 */
export function InactiveRoleModal({ open, onOpenChange, role }: InactiveRoleModalProps) {
    const { mutate, isPending } = useToggleRoleStatus();

    function handleConfirm() {
        if (!role) {
            return;
        }

        mutate(
            { cd_id: role.cd_id, fl_active: false },
            { onSettled: () => onOpenChange(false) },
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <ShieldOff className="size-4 text-core-neutral" aria-hidden="true" />
                        Inativar role
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {role ? (
                            <>
                                Tem certeza que deseja inativar <strong>{role.ds_name}</strong>?
                                Usuários vinculados a esta role deixarão de herdar suas permissões.
                            </>
                        ) : (
                            "Tem certeza que deseja inativar esta role?"
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
