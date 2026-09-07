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

import { useToggleModuleStatus } from "../hooks/use-toggle-module-status";
import type { CoreModule } from "../hooks/use-fetch-modules";

interface InactiveModuleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    module: CoreModule | null;
}

/**
 * Confirmação destrutiva de inativação de módulo (RF022) via `AlertDialog`.
 * Nunca é aberto para o módulo "Core" (`ds_key === "core"`) — a UI já bloqueia
 * o gatilho, e `useToggleModuleStatus` rejeitaria a mutation de qualquer
 * forma. Reativar não passa por este modal — é uma ação direta (não é
 * destrutiva).
 */
export function InactiveModuleModal({ open, onOpenChange, module }: InactiveModuleModalProps) {
    const { mutate, isPending } = useToggleModuleStatus();

    function handleConfirm() {
        if (!module) {
            return;
        }

        mutate(
            { cd_id: module.cd_id, ds_key: module.ds_key, fl_active: false },
            { onSettled: () => onOpenChange(false) },
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <ShieldOff className="size-4 text-core-neutral" aria-hidden="true" />
                        Inativar módulo
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {module ? (
                            <>
                                Tem certeza que deseja inativar <strong>{module.ds_name}</strong>?
                                O módulo deixará de aparecer como disponível no catálogo.
                            </>
                        ) : (
                            "Tem certeza que deseja inativar este módulo?"
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
