import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
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

import { useCreateUser } from "../hooks/use-create-user";
import { UserFormFields } from "./user-form-fields";
import { userFormSchema, type UserFormValues } from "./user-form-schema";

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: UserFormValues = {
    ds_name: "",
    ds_email: "",
    ds_role_description: "",
    fl_active: "true",
};

/**
 * Modal de criação de usuário (RF008) — mutation mockada via `useCreateUser`,
 * sem persistência real. Ver docs/architecture/core-module-roadmap.md.
 */
export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { mutateAsync, isPending } = useCreateUser();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: UserFormValues) {
        await mutateAsync({
            ds_name: values.ds_name,
            ds_email: values.ds_email,
            ds_role_description: values.ds_role_description,
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
                    <DialogTitle>Novo usuário</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo usuário administrado pelo módulo Core. Dado mockado, sem
                        persistência real.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <UserFormFields register={register} errors={errors} control={control} />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <UserPlus className="size-4" />
                            {isPending ? "Salvando..." : "Criar usuário"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
