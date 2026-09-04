import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "../hooks/use-fetch-users";
import { useChangePassword } from "../hooks/use-change-password";

interface ChangePasswordModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    user: User | null;
}

interface FormState {
    senha: string;
    confirmarSenha: string;
}

interface FieldErrors {
    senha?: string;
    confirmarSenha?: string;
}

const EMPTY_FORM: FormState = {
    senha: "",
    confirmarSenha: "",
};

export function ChangePasswordModal({
    open,
    onOpenChange,
    user,
}: ChangePasswordModalProps) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const changePassword = useChangePassword();

    // Reseta o formulário ao fechar (nunca manter senha em memória).
    useEffect(() => {
        if (!open) {
            setForm(EMPTY_FORM);
            setErrors({});
            setFormError(null);
        }
    }, [open]);

    function handleChange<K extends keyof FormState>(key: K, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function validate(): boolean {
        const nextErrors: FieldErrors = {};

        if (!form.senha) {
            nextErrors.senha = "Informe a senha.";
        } else if (form.senha.length < 6 || form.senha.length > 250) {
            nextErrors.senha = "A senha deve ter entre 6 e 250 caracteres.";
        }

        if (!form.confirmarSenha) {
            nextErrors.confirmarSenha = "Confirme a senha.";
        } else if (form.senha !== form.confirmarSenha) {
            nextErrors.confirmarSenha = "As senhas não coincidem.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setFormError(null);

        if (!user) return;
        if (!validate()) return;

        try {
            await changePassword.mutateAsync({
                id: user.cd_id,
                senha: form.senha,
            });

            // Idealmente exibir toast de sucesso aqui.
            onOpenChange?.(false);
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            setFormError("Não foi possível alterar a senha. Tente novamente.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Alterar senha</DialogTitle>
                    <DialogDescription>
                        {user
                            ? `Defina uma nova senha para ${user.ds_name}.`
                            : "Defina uma nova senha."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new_password">
                            Nova senha <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="new_password"
                            type="password"
                            value={form.senha}
                            onChange={(e) => handleChange("senha", e.target.value)}
                            placeholder="Mínimo de 6 caracteres"
                            autoComplete="new-password"
                        />
                        {errors.senha && (
                            <p className="text-sm text-red-500">{errors.senha}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">
                            Confirmar senha <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="confirm_password"
                            type="password"
                            value={form.confirmarSenha}
                            onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                            placeholder="Repita a senha"
                            autoComplete="new-password"
                        />
                        {errors.confirmarSenha && (
                            <p className="text-sm text-red-500">{errors.confirmarSenha}</p>
                        )}
                    </div>

                    {formError && <p className="text-sm text-red-500">{formError}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            disabled={changePassword.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={changePassword.isPending || !user}>
                            {changePassword.isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Alterar senha
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}