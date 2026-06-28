import { useChangePaswordRequest } from "@/api/users/use-change-password";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    KeyRound,
    Save,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdatePasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: number;
}

const updatePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Informe a senha atual"),

        newPassword: z
            .string()
            .min(
                8,
                "A senha deve possuir no mínimo 8 caracteres"
            ),

        confirmPassword: z
            .string()
            .min(1, "Confirme a nova senha"),
    })
    .refine(
        (data) =>
            data.newPassword === data.confirmPassword,
        {
            message: "As senhas não coincidem",
            path: ["confirmPassword"],
        }
    );

type UpdatePasswordForm = z.infer<
    typeof updatePasswordSchema
>;

export function UpdatePasswordModal({
    open,
    onOpenChange,
}: UpdatePasswordModalProps) {
    const [showCurrent, setShowCurrent] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdatePasswordForm>({
        resolver: zodResolver(
            updatePasswordSchema
        ),
    });

    const {isPending, mutateAsync } = useChangePaswordRequest()

    async function handleUpdate(
        data: UpdatePasswordForm
    ) {
        try {
            await mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });

            toast.success(
                "Senha atualizada com sucesso",
                {
                    position: "top-center",
                    richColors: true,
                }
            );

            reset();

            onOpenChange(false);
        } catch {
            toast.error(
                "Não foi possível atualizar a senha",
                {
                    position: "top-center",
                    richColors: true,
                }
            );
        }
    }

    const PasswordInput = ({
        label,
        error,
        register,
        visible,
        setVisible,
    }: any) => (
        <div className="space-y-2">
            <Label>{label}</Label>

            <div className="relative">
                <Input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    {...register}
                />

                <button
                    type="button"
                    onClick={() =>
                        setVisible(!visible)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    {visible ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </button>
            </div>

            {error && (
                <span className="text-sm text-red-500">
                    {error.message}
                </span>
            )}
        </div>
    );

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <KeyRound className="size-5" />

                        <DialogTitle>
                            Atualizar Senha
                        </DialogTitle>
                    </div>

                    <DialogDescription>
                        Informe sua senha atual e
                        defina uma nova senha para
                        sua conta.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(
                        handleUpdate
                    )}
                    className="space-y-4"
                >
                    <PasswordInput
                        label="Senha Atual"
                        register={register(
                            "currentPassword"
                        )}
                        error={
                            errors.currentPassword
                        }
                        visible={showCurrent}
                        setVisible={
                            setShowCurrent
                        }
                    />

                    <PasswordInput
                        label="Nova Senha"
                        register={register(
                            "newPassword"
                        )}
                        error={
                            errors.newPassword
                        }
                        visible={showNew}
                        setVisible={setShowNew}
                    />

                    <PasswordInput
                        label="Confirmar Senha"
                        register={register(
                            "confirmPassword"
                        )}
                        error={
                            errors.confirmPassword
                        }
                        visible={showConfirm}
                        setVisible={
                            setShowConfirm
                        }
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(
                                    false
                                )
                            }
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            <Save />

                            {isPending
                                ? "Atualizando..."
                                : "Atualizar Senha"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}