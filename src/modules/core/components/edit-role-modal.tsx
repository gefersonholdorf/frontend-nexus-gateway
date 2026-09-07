import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
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

import { useUpdateRole } from "../hooks/use-update-role";
import type { CoreRole } from "../hooks/use-fetch-roles";
import { RoleFormFields } from "./role-form-fields";
import { roleFormSchema, type RoleFormValues } from "./role-form-schema";

interface EditRoleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: CoreRole | null;
}

/**
 * Modal de edição de role (RF013) — `useUpdateRole` chama `PUT /roles/{id}`.
 */
export function EditRoleModal({ open, onOpenChange, role }: EditRoleModalProps) {
    const { mutateAsync, isPending } = useUpdateRole();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            ds_name: "",
            ds_description: "",
            fl_active: "true",
        },
    });

    useEffect(() => {
        if (role) {
            reset({
                ds_name: role.ds_name,
                ds_description: role.ds_description,
                fl_active: role.fl_active ? "true" : "false",
            });
        }
    }, [role, reset]);

    async function onSubmit(values: RoleFormValues) {
        if (!role) {
            return;
        }

        await mutateAsync({
            cd_id: role.cd_id,
            ds_name: values.ds_name,
            ds_description: values.ds_description,
            fl_active: values.fl_active === "true",
        });

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar role</DialogTitle>
                    <DialogDescription>
                        Atualize os dados de {role?.ds_name ?? "role"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <RoleFormFields register={register} errors={errors} control={control} />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Save className="size-4" />
                            {isPending ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
