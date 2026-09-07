import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CoreUser } from "../hooks/use-fetch-users";
import { useUpdateUserPassword } from "../hooks/use-update-user-password";
import {
    changeUserPasswordSchema,
    type ChangeUserPasswordValues,
} from "./change-user-password-schema";

interface ChangeUserPasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: CoreUser | null;
}

const DEFAULT_VALUES: ChangeUserPasswordValues = {
    senha: "",
    confirmarSenha: "",
};

/**
 * Modal de alteração de senha de usuário (RF013) — `PATCH /users/{id}/password`.
 * Ação gated por `users.manage`, mesma permissão já usada nas demais ações de
 * escrita sobre usuário em `core-users-page.tsx`.
 */
export function ChangeUserPasswordModal({
    open,
    onOpenChange,
    user,
}: ChangeUserPasswordModalProps) {
    const { mutateAsync, isPending } = useUpdateUserPassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangeUserPasswordValues>({
        resolver: zodResolver(changeUserPasswordSchema),
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (open) {
            reset(DEFAULT_VALUES);
        }
    }, [open, reset]);

    async function onSubmit(values: ChangeUserPasswordValues) {
        if (!user) {
            return;
        }

        await mutateAsync({ cd_id: user.cd_id, senha: values.senha });

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="size-4" aria-hidden="true" />
                        Alterar senha
                    </DialogTitle>
                    <DialogDescription>
                        Defina uma nova senha para {user?.ds_name ?? "usuário"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="senha">Nova senha</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                        <Input
                            id="confirmarSenha"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...register("confirmarSenha")}
                        />
                        {errors.confirmarSenha && (
                            <span className="text-sm text-destructive">
                                {errors.confirmarSenha.message}
                            </span>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <KeyRound className="size-4" />
                            {isPending ? "Salvando..." : "Alterar senha"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
