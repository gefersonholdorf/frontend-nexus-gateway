import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type DocumentForm = {
    code: string;
    title: string;
    category: string;
    status: string;
    updatedAt: string;
    responsible: string;
};

export function CreateDocumentModal({
    open,
    onOpenChange,
}: CreateDocumentModalProps) {
    const [form, setForm] = useState<DocumentForm>({
        code: "",
        title: "",
        category: "",
        status: "",
        updatedAt: "",
        responsible: "",
    });

    const { mutateAsync, isPending } = useMutation({
        mutationKey: ["create-document"],
        mutationFn: async (data: DocumentForm) => {
            const response = await fetch("http://127.0.0.1:3336/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar documento");
            }

            return response.json();
        },
    });

    const handleChange = (field: keyof DocumentForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await mutateAsync(form);

            toast.success("Documento criado com sucesso!", {
                position: "top-center",
                richColors: true,
            });

            onOpenChange(false);

            setForm({
                code: "",
                title: "",
                category: "",
                status: "",
                updatedAt: "",
                responsible: "",
            });
        } catch (error) {
            console.error(error);

            toast.error("Erro ao criar documento.", {
                position: "top-center",
                richColors: true,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="border-b bg-muted/40 p-6">
                    <DialogTitle>Criar Documento</DialogTitle>
                    <DialogDescription>
                        Preencha os dados para cadastrar um novo documento.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Código</Label>
                            <Input
                                value={form.code}
                                onChange={(e) =>
                                    handleChange("code", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Documento</Label>
                            <Input
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                                onValueChange={(value) =>
                                    handleChange("category", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="pol">
                                            Política
                                        </SelectItem>
                                        <SelectItem value="proc">
                                            Procedimento
                                        </SelectItem>
                                        <SelectItem value="man">
                                            Manual
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                onValueChange={(value) =>
                                    handleChange("status", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="vigente">
                                            Vigente
                                        </SelectItem>
                                        <SelectItem value="andamento">
                                            Em Andamento
                                        </SelectItem>
                                        <SelectItem value="revisao">
                                            Em Revisão
                                        </SelectItem>
                                        <SelectItem value="pendente">
                                            Pendente
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Atualizado</Label>
                            <Input
                                type="date"
                                value={form.updatedAt}
                                onChange={(e) =>
                                    handleChange("updatedAt", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Responsável</Label>
                            <Select
                                onValueChange={(value) =>
                                    handleChange("responsible", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="rh">RH</SelectItem>
                                        <SelectItem value="infra">
                                            Infra
                                        </SelectItem>
                                        <SelectItem value="suporte">
                                            Suporte
                                        </SelectItem>
                                        <SelectItem value="dev">
                                            Desenvolvedor
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            <Save />
                            {isPending
                                ? "Salvando..."
                                : "Criar Documento"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}