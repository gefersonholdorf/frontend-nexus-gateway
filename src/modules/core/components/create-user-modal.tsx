import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import {
    useForm,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateUser } from "../hooks/use-create-user";
import { createUserFormSchema, type CreateUserFormValues } from "./create-user-form-schema";
import { UserFormFields } from "./user-form-fields";
import type { UserFormValues } from "./user-form-schema";

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: CreateUserFormValues = {
    ds_name: "",
    ds_email: "",
    ds_role_description: "",
    fl_active: "true",
    senha: "",
};

/**
 * Modal de criação de usuário (RF011) — `useCreateUser` chama `POST /users`.
 */
export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { mutateAsync, isPending } = useCreateUser();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: CreateUserFormValues) {
        await mutateAsync({
            ds_name: values.ds_name,
            ds_email: values.ds_email,
            ds_role_description: values.ds_role_description,
            fl_active: values.fl_active === "true",
            senha: values.senha,
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
                        Cadastre um novo usuário administrado pelo módulo Core.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* `CreateUserFormValues` estende `UserFormValues` (senha a mais) —
                    os campos comuns são os mesmos em runtime, então o cast é seguro
                    aqui (`Control`/`UseFormRegister` não são covariantes o
                    suficiente para o TS aceitar o supertipo diretamente). */}
                    <UserFormFields
                        register={register as unknown as UseFormRegister<UserFormValues>}
                        errors={errors as unknown as FieldErrors<UserFormValues>}
                        control={control as unknown as Control<UserFormValues>}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="senha">Senha</Label>
                        <Input
                            id="senha"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...register("senha")}
                        />
                        {errors.senha && (
                            <span className="text-sm text-destructive">{errors.senha.message}</span>
                        )}
                    </div>

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
