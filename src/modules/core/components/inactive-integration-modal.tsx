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

import { useToggleIntegrationStatus } from "../hooks/use-toggle-integration-status";
import type { CoreIntegration } from "../hooks/use-fetch-integrations";

interface InactiveIntegrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    integration: CoreIntegration | null;
}

/**
 * Confirmação destrutiva de inativação de integração (RF026) via
 * `AlertDialog` — espelha `inactive-module-modal.tsx`. Reativar não passa por
 * este modal — é uma ação direta no `Switch` do card (não é destrutiva).
 */
export function InactiveIntegrationModal({
    open,
    onOpenChange,
    integration,
}: InactiveIntegrationModalProps) {
    const { mutate, isPending } = useToggleIntegrationStatus();

    function handleConfirm() {
        if (!integration) {
            return;
        }

        mutate(
            { cd_id: integration.cd_id, fl_active: false },
            { onSettled: () => onOpenChange(false) },
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <ShieldOff className="size-4 text-core-neutral" aria-hidden="true" />
                        Inativar integração
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {integration ? (
                            <>
                                Tem certeza que deseja inativar <strong>{integration.ds_name}</strong>?
                                Ela deixará de ser usada pelos módulos vinculados até ser reativada.
                            </>
                        ) : (
                            "Tem certeza que deseja inativar esta integração?"
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
