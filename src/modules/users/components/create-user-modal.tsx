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
import { useCreateUser } from "../hooks/use-create-user";

interface CreateUserModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface FormState {
    ds_name: string;
    ds_email: string;
    senha: string;
    ds_role_description: string;
    ds_vpn_name: string;
    ds_avatar_url: string;
}

interface FieldErrors {
    ds_name?: string;
    ds_email?: string;
    senha?: string;
}

const INITIAL_FORM: FormState = {
    ds_name: "",
    ds_email: "",
    senha: "",
    ds_role_description: "",
    ds_vpn_name: "",
    ds_avatar_url: "",
};

// Validação simples de e-mail (formato básico).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const createUser = useCreateUser();

    useEffect(() => {
        if (!open) {
            setForm(INITIAL_FORM);
            setErrors({});
            setFormError(null);
        }
    }, [open]);

    function handleChange<K extends keyof FormState>(key: K, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    // Validação client-side dos campos obrigatórios.
    function validate(): boolean {
        const nextErrors: FieldErrors = {};

        if (!form.ds_name.trim()) {
            nextErrors.ds_name = "Informe o nome.";
        }

        if (!form.ds_email.trim()) {
            nextErrors.ds_email = "Informe o e-mail.";
        } else if (!EMAIL_REGEX.test(form.ds_email.trim())) {
            nextErrors.ds_email = "E-mail inválido.";
        }

        if (!form.senha) {
            nextErrors.senha = "Informe a senha.";
        } else if (form.senha.length < 6 || form.senha.length > 250) {
            nextErrors.senha = "A senha deve ter entre 6 e 250 caracteres.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setFormError(null);

        if (!validate()) return;

        try {
            await createUser.mutateAsync({
                ds_name: form.ds_name.trim(),
                ds_email: form.ds_email.trim(),
                senha: form.senha,
                ds_role_description: form.ds_role_description.trim() || undefined,
                ds_vpn_name: form.ds_vpn_name.trim() || undefined,
                ds_avatar_url: form.ds_avatar_url.trim() || undefined,
            });

            // Idealmente exibir toast de sucesso aqui.
            onOpenChange?.(false);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            setFormError("Não foi possível criar o usuário. Tente novamente.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Novo usuário</DialogTitle>
                    <DialogDescription>
                        Preencha os dados para cadastrar um novo usuário no sistema.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ds_name">
                            Nome <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="ds_name"
                            value={form.ds_name}
                            onChange={(e) => handleChange("ds_name", e.target.value)}
                            placeholder="Nome completo"
                            autoComplete="off"
                        />
                        {errors.ds_name && (
                            <p className="text-sm text-red-500">{errors.ds_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ds_email">
                            E-mail <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="ds_email"
                            type="email"
                            value={form.ds_email}
                            onChange={(e) => handleChange("ds_email", e.target.value)}
                            placeholder="usuario@empresa.com"
                            autoComplete="off"
                        />
                        {errors.ds_email && (
                            <p className="text-sm text-red-500">{errors.ds_email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="senha">
                            Senha <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="senha"
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
                        <Label htmlFor="ds_role_description">Cargo/Descrição</Label>
                        <Input
                            id="ds_role_description"
                            value={form.ds_role_description}
                            onChange={(e) =>
                                handleChange("ds_role_description", e.target.value)
                            }
                            placeholder="Opcional"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ds_vpn_name">Nome na VPN</Label>
                        <Input
                            id="ds_vpn_name"
                            value={form.ds_vpn_name}
                            onChange={(e) => handleChange("ds_vpn_name", e.target.value)}
                            placeholder="Opcional"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ds_avatar_url">URL do avatar</Label>
                        <Input
                            id="ds_avatar_url"
                            type="url"
                            value={form.ds_avatar_url}
                            onChange={(e) => handleChange("ds_avatar_url", e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    {formError && <p className="text-sm text-red-500">{formError}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            disabled={createUser.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createUser.isPending}>
                            {createUser.isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Criar usuário
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}