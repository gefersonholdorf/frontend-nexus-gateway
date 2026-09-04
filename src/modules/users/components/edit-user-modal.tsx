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
import { useUpdateUser } from "../hooks/use-update-user";

interface EditUserModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    user: User | null;
}

interface FormState {
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    ds_vpn_name: string;
    ds_avatar_url: string;
}

interface FieldErrors {
    ds_name?: string;
    ds_email?: string;
}

const EMPTY_FORM: FormState = {
    ds_name: "",
    ds_email: "",
    ds_role_description: "",
    ds_vpn_name: "",
    ds_avatar_url: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const updateUser = useUpdateUser();

    // Popula o formulário sempre que abrir ou trocar o usuário.
    useEffect(() => {
        if (open && user) {
            setForm({
                ds_name: user.ds_name ?? "",
                ds_email: user.ds_email ?? "",
                ds_role_description: user.ds_role_description ?? "",
                ds_vpn_name: user.ds_vpn_name ?? "",
                ds_avatar_url: user.ds_avatar_url ?? "",
            });
            setErrors({});
            setFormError(null);
        }
    }, [open, user]);

    function handleChange<K extends keyof FormState>(key: K, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

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

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setFormError(null);

        if (!user) return;
        if (!validate()) return;

        try {
            await updateUser.mutateAsync({
                id: user.cd_id,
                ds_name: form.ds_name.trim(),
                ds_email: form.ds_email.trim(),
                ds_role_description: form.ds_role_description.trim() || undefined,
                ds_vpn_name: form.ds_vpn_name.trim() || undefined,
                ds_avatar_url: form.ds_avatar_url.trim() || undefined,
            });

            // Idealmente exibir toast de sucesso aqui.
            onOpenChange?.(false);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            setFormError("Não foi possível atualizar o usuário. Tente novamente.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar usuário</DialogTitle>
                    <DialogDescription>
                        Atualize os dados do usuário. A senha é alterada em uma ação
                        separada.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit_ds_name">
                            Nome <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit_ds_name"
                            value={form.ds_name}
                            onChange={(e) => handleChange("ds_name", e.target.value)}
                            placeholder="Nome completo"
                        />
                        {errors.ds_name && (
                            <p className="text-sm text-red-500">{errors.ds_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_ds_email">
                            E-mail <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit_ds_email"
                            type="email"
                            value={form.ds_email}
                            onChange={(e) => handleChange("ds_email", e.target.value)}
                            placeholder="usuario@empresa.com"
                        />
                        {errors.ds_email && (
                            <p className="text-sm text-red-500">{errors.ds_email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_ds_role_description">Cargo/Descrição</Label>
                        <Input
                            id="edit_ds_role_description"
                            value={form.ds_role_description}
                            onChange={(e) =>
                                handleChange("ds_role_description", e.target.value)
                            }
                            placeholder="Opcional"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_ds_vpn_name">Nome na VPN</Label>
                        <Input
                            id="edit_ds_vpn_name"
                            value={form.ds_vpn_name}
                            onChange={(e) => handleChange("ds_vpn_name", e.target.value)}
                            placeholder="Opcional"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_ds_avatar_url">URL do avatar</Label>
                        <Input
                            id="edit_ds_avatar_url"
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
                            disabled={updateUser.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={updateUser.isPending || !user}>
                            {updateUser.isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Salvar alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}