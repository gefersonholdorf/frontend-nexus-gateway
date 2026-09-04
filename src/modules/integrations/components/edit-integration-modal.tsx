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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Integration } from "../hooks/use-fetch-integrations";
import { useUpdateIntegration } from "../hooks/use-update-integration";

interface EditIntegrationModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    integration: Integration | null;
}

interface FormState {
    ds_name: string;
    ds_config: string; // JSON como texto; parseado no submit.
    secret: string; // write-only; sempre inicia vazio.
    fl_active: boolean;
}

interface FieldErrors {
    ds_name?: string;
    ds_config?: string;
}

const EMPTY_FORM: FormState = {
    ds_name: "",
    ds_config: "",
    secret: "",
    fl_active: true,
};

export function EditIntegrationModal({
    open,
    onOpenChange,
    integration,
}: EditIntegrationModalProps) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const updateIntegration = useUpdateIntegration();

    // Popula o formulário ao abrir/trocar a integração.
    // secret NÃO é populado (write-only) — sempre inicia vazio.
    useEffect(() => {
        if (open && integration) {
            setForm({
                ds_name: integration.ds_name ?? "",
                ds_config: integration.ds_config
                    ? JSON.stringify(integration.ds_config, null, 2)
                    : "",
                secret: "",
                fl_active: integration.fl_active,
            });
            setErrors({});
            setFormError(null);
        }
    }, [open, integration]);

    function handleChange<K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    // Faz o parse do ds_config e retorna o objeto ou undefined.
    function parseConfig(): Record<string, unknown> | undefined {
        const raw = form.ds_config.trim();
        if (!raw) return undefined;
        return JSON.parse(raw) as Record<string, unknown>;
    }

    function validate(): boolean {
        const nextErrors: FieldErrors = {};

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

        if (!integration) return;
        if (!validate()) return;

        try {
            const ds_config = parseConfig();

            await updateIntegration.mutateAsync({
                id: integration.cd_id,
                ds_name: form.ds_name.trim(),
                ds_config,
                // secret é write-only: só envia quando o usuário digita algo novo.
                secret: form.secret ? form.secret : undefined,
                fl_active: form.fl_active,
            });

            // Idealmente exibir toast de sucesso aqui.
            onOpenChange?.(false);
        } catch (error) {
            console.error("Erro ao atualizar integração:", error);
            setFormError("Não foi possível atualizar a integração. Tente novamente.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar integração</DialogTitle>
                    <DialogDescription>
                        Atualize os dados da integração. O tipo não pode ser alterado.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        {/* ds_type é somente leitura: o update não altera o tipo. */}
                        <div>
                            <Badge variant="outline" className="text-xs">
                                {integration?.ds_type ?? "---"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_integration_ds_name">
                            Nome <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit_integration_ds_name"
                            value={form.ds_name}
                            onChange={(e) => handleChange("ds_name", e.target.value)}
                            placeholder="Ex.: GLPI Produção"
                        />
                        {errors.ds_name && (
                            <p className="text-sm text-red-500">{errors.ds_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_integration_ds_config">
                            Configuração (JSON)
                        </Label>
                        <Textarea
                            id="edit_integration_ds_config"
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
                        <Label htmlFor="edit_integration_secret">Segredo</Label>
                        {/* secret é write-only: nunca vem do backend.
                Deixar em branco mantém o segredo atual. */}
                        <Input
                            id="edit_integration_secret"
                            type="password"
                            value={form.secret}
                            onChange={(e) => handleChange("secret", e.target.value)}
                            placeholder="Deixe em branco para manter o segredo atual"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-border p-3">
                        <div className="flex flex-col">
                            <Label htmlFor="edit_integration_fl_active">Ativa</Label>
                            <span className="text-xs text-muted-foreground">
                                Habilita ou desabilita a integração.
                            </span>
                        </div>
                        <Switch
                            id="edit_integration_fl_active"
                            checked={form.fl_active}
                            onCheckedChange={(checked) => handleChange("fl_active", checked)}
                            aria-label={form.fl_active ? "Desativar integração" : "Ativar integração"}
                        />
                    </div>

                    {formError && <p className="text-sm text-red-500">{formError}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            disabled={updateIntegration.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateIntegration.isPending || !integration}
                        >
                            {updateIntegration.isPending && (
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