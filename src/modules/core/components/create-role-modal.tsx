import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useCreateRole } from "../hooks/use-create-role";
import { RoleFormFields } from "./role-form-fields";
import { roleFormSchema, type RoleFormValues } from "./role-form-schema";

interface CreateRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: RoleFormValues = {
    ds_name: "",
    ds_description: "",
    fl_active: "true",
};

/**
 * Modal de criação de role (RF013) — `useCreateRole` chama `POST /roles`.
 */
export function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
    const { mutateAsync, isPending } = useCreateRole();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: RoleFormValues) {
        await mutateAsync({
            ds_name: values.ds_name,
            ds_description: values.ds_description,
            fl_active: values.fl_active === "true",
        });

        reset(DEFAULT_VALUES);
        onOpenChange(false);
    }

    function handleOpenChange(next: boolean) {
        if (!next) {
            reset(DEFAULT_VALUES);
        }
        onOpenChange(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nova role</DialogTitle>
                    <DialogDescription>
                        Cadastre uma nova role (perfil de acesso) administrada pelo módulo Core.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <RoleFormFields register={register} errors={errors} control={control} />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <ShieldPlus className="size-4" />
                            {isPending ? "Salvando..." : "Criar role"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
