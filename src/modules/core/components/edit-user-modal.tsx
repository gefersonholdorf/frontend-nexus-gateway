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

import { useUpdateUser } from "../hooks/use-update-user";
import type { CoreUser } from "../hooks/use-fetch-users";
import { UserFormFields } from "./user-form-fields";
import { userFormSchema, type UserFormValues } from "./user-form-schema";

interface EditUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: CoreUser | null;
}

/**
 * Modal de edição de usuário (RF011) — `useUpdateUser` chama `PUT /users/{id}`.
 */
export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
    const { mutateAsync, isPending } = useUpdateUser();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            ds_name: "",
            ds_email: "",
            ds_role_description: "",
            fl_active: "true",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                ds_name: user.ds_name,
                ds_email: user.ds_email,
                ds_role_description: user.ds_role_description,
                fl_active: user.fl_active ? "true" : "false",
            });
        }
    }, [user, reset]);

    async function onSubmit(values: UserFormValues) {
        if (!user) {
            return;
        }

        await mutateAsync({
            cd_id: user.cd_id,
            ds_name: values.ds_name,
            ds_email: values.ds_email,
            ds_role_description: values.ds_role_description,
            fl_active: values.fl_active === "true",
        });

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar usuário</DialogTitle>
                    <DialogDescription>
                        Atualize os dados de {user?.ds_name ?? "usuário"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <UserFormFields register={register} errors={errors} control={control} />

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
