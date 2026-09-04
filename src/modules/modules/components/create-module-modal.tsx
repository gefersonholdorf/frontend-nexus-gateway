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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateModule } from "../hooks/use-create-module";

interface CreateModuleModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface FormState {
    ds_key: string;
    ds_name: string;
    ds_description: string;
}

interface FieldErrors {
    ds_key?: string;
    ds_name?: string;
}

const INITIAL_FORM: FormState = {
    ds_key: "",
    ds_name: "",
    ds_description: "",
};

export function CreateModuleModal({
    open,
    onOpenChange,
}: CreateModuleModalProps) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);

    const createModule = useCreateModule();

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

    function validate(): boolean {
        const nextErrors: FieldErrors = {};

        if (!form.ds_key.trim()) {
            nextErrors.ds_key = "Informe a chave do módulo.";
        }

        if (!form.ds_name.trim()) {
            nextErrors.ds_name = "Informe o nome do módulo.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setFormError(null);

        if (!validate()) return;

        try {
            await createModule.mutateAsync({
                ds_key: form.ds_key.trim(),
                ds_name: form.ds_name.trim(),
                ds_description: form.ds_description.trim() || undefined,
            });

            // Idealmente exibir toast de sucesso aqui.
            onOpenChange?.(false);
        } catch (error) {
            console.error("Erro ao criar módulo:", error);
            setFormError("Não foi possível criar o módulo. Tente novamente.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Novo módulo</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo módulo do sistema informando sua chave e nome.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="module_ds_key">
                            Chave <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="module_ds_key"
                            value={form.ds_key}
                            onChange={(e) => handleChange("ds_key", e.target.value)}
                            placeholder="Ex.: documents"
                            className="font-mono"
                        />
                        {errors.ds_key && (
                            <p className="text-sm text-red-500">{errors.ds_key}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="module_ds_name">
                            Nome <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="module_ds_name"
                            value={form.ds_name}
                            onChange={(e) => handleChange("ds_name", e.target.value)}
                            placeholder="Ex.: Documentos"
                        />
                        {errors.ds_name && (
                            <p className="text-sm text-red-500">{errors.ds_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="module_ds_description">Descrição</Label>
                        <Textarea
                            id="module_ds_description"
                            value={form.ds_description}
                            onChange={(e) => handleChange("ds_description", e.target.value)}
                            placeholder="Opcional"
                            rows={3}
                        />
                    </div>

                    {formError && <p className="text-sm text-red-500">{formError}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            disabled={createModule.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createModule.isPending}>
                            {createModule.isPending && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Criar módulo
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}