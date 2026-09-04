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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateIntegration } from "../hooks/use-create-integration";

interface CreateIntegrationModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface FormState {
    ds_type: string;
    ds_name: string;
    ds_config: string; // JSON como texto; parseado no submit.
    secret: string; // write-only; só enviado se preenchido.
}

interface FieldErrors {
    ds_type?: string;
    ds_name?: string;
    ds_config?: string;
}

const INITIAL_FORM: FormState = {
    ds_type: "",
    ds_name: "",
    ds_config: "",
    secret: "",
};

// Tipos suportados — lista extensível conforme novos conectores.
const INTEGRATION_TYPES = ["GLPI", "Microsoft", "Jira"] as const;

export function CreateIntegrationModal({
    open,
    onOpenChange,
}: CreateIntegrationModalProps) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const createIntegration = useCreateIntegration();

    // Reseta o formulário ao fechar.
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

    // Faz o parse do ds_config e retorna o objeto ou undefined.
    // Lança erro quando o JSON é inválido (tratado no validate/submit).
    function parseConfig(): Record<string, unknown> | undefined {
        const raw = form.ds_config.trim();
        if (!raw) return undefined;
        return JSON.parse(raw) as Record<string, unknown>;
    }

    function validate(): boolean {
        const nextErrors: FieldErrors = {};

        if (!form.ds_type.trim()) {
            nextErrors.ds_type = "Selecione o tipo da integração.";
        }

        if (!form.ds_name.trim()) {
            nextErrors.ds_name = "Informe o nome da integração.";
        }

        // Valida o JSON apenas se houver conteúdo.
        if (form.ds_config.trim()) {
            try {
                JSON.parse(form.ds_config);
            } catch {
                nextErrors.ds_config = "JSON inválido.";
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setFormError(null);

        if (!validate()) return;

        try {
            const ds_config = parseConfig();

            await createIntegration.mutateAsync({
                ds_type: form.ds_type.trim(),
                ds_name: form.ds_name.trim(),
                ds_config,
                // secret é write-only: só envia quando o usuário preenche.
                secret: form.secret ? form.secret : undefined,
            });

            // Idealmente exibir toast de sucesso aqui.
            onOpenChange?.(false);
        } catch (error) {
            console.error("Erro ao criar integração:", error);
            setFormError("Não foi possível criar a integração. Tente novamente.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nova integração</DialogTitle>
                    <DialogDescription>
                        Configure uma nova integração externa do sistema.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="integration_ds_type">
                            Tipo <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={form.ds_type}
                            onValueChange={(value) => handleChange("ds_type", value)}
                        >
                            <SelectTrigger id="integration_ds_type">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {INTEGRATION_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.ds_type && (
                            <p className="text-sm text-red-500">{errors.ds_type}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="integration_ds_name">
                            Nome <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="integration_ds_name"
                            value={form.ds_name}
                            onChange={(e) => handleChange("ds_name", e.target.value)}
                            placeholder="Ex.: GLPI Produção"
                        />
                        {errors.ds_name && (
                            <p className="text-sm text-red-500">{errors.ds_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="integration_ds_config">Configuração (JSON)</Label>
                        <Textarea
                            id="integration_ds_config"
                            value={form.ds_config}
                            onChange={(e) => handleChange("ds_config", e.target.value)}
                            placeholder='{ "baseUrl": "https://..." }'
                            rows={4}
                            className="font-mono text-sm"
                        />
                        {errors.ds_config && (
                            <p className="text-sm text-red-500">{errors.ds_config}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="integration_secret">Segredo</Label>
                        {/* secret é write-only: nunca vem do backend; só enviado se preenchido. */}
                        <Input
                            id="integration_secret"
                            type="password"
                            value={form.secret}
                            onChange={(e) => handleChange("secret", e.target.value)}
                            placeholder="Token/senha da integração (opcional)"
                            autoComplete="new-password"
                        />
                    </div>

                    {formError && <p className="text-sm text-red-500">{formError}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            disabled={createIntegration.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createIntegration.isPending}>
                            {createIntegration.isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Criar integração
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}