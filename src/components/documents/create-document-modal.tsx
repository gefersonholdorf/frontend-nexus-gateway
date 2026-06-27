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
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { useCreateDocument } from "@/api/documents/create-document";

interface CreateDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const createDocumentSchema = z.object({
    code: z.string().min(1, "Código obrigatório"),
    title: z.string().min(1, "Título obrigatório"),
    category: z.string().min(1, "Categoria obrigatória"),
    status: z.string().min(1, "Status obrigatório"),
    url: z.url("URL inválida"),
    responsible: z.string().min(1, "Responsável obrigatório"),
});

type CreateDocumentSchema = z.infer<typeof createDocumentSchema>;

export function CreateDocumentModal({
    open,
    onOpenChange,
}: CreateDocumentModalProps) {
    const [formError, setFormError] = useState<string | null>(null);
    const { mutateAsync, isPending } = useCreateDocument()

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateDocumentSchema>({
        resolver: zodResolver(createDocumentSchema),
        defaultValues: {
            code: "",
            category: "",
            responsible: "",
            status: "",
            title: "",
            url: "",
        },
    });

    async function handleCreateDocumentSubmit(data: CreateDocumentSchema) {
        try {
            setFormError(null);

            await mutateAsync(data);

            toast.success("Documento criado com sucesso!", {
                position: "top-center",
                richColors: true,
            });

            reset();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            setFormError("Erro ao criar documento.");

            toast.error("Erro ao criar documento.", {
                position: "top-center",
                richColors: true,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="border-b bg-muted/40 p-6">
                    <DialogTitle>Criar Documento</DialogTitle>
                    <DialogDescription>
                        Preencha os dados para cadastrar um novo documento.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(handleCreateDocumentSubmit)}
                    className="space-y-6 p-6"
                >
                    {formError && (
                        <p className="text-sm text-red-500">{formError}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Código</Label>
                            <Input
                                placeholder="Informe o código..."
                                {...register("code")}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Documento</Label>
                            <Input
                                placeholder="Informe o título..."
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("category", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Política">
                                            Política
                                        </SelectItem>
                                        <SelectItem value="Procedimento">
                                            Procedimento
                                        </SelectItem>
                                        <SelectItem value="Manual">
                                            Manual
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("status", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Vigente">
                                            Vigente
                                        </SelectItem>
                                        <SelectItem value="Em Andamento">
                                            Em Andamento
                                        </SelectItem>
                                        <SelectItem value="Em Revisão">
                                            Em Revisão
                                        </SelectItem>
                                        <SelectItem value="Pendente">
                                            Pendente
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-500">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Localização do Documento</Label>
                            <Input
                                placeholder="Informe a url do documento..."
                                {...register("url")}
                            />
                            {errors.url && (
                                <p className="text-sm text-red-500">
                                    {errors.url.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Responsável</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("responsible", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="RH">RH</SelectItem>
                                        <SelectItem value="Infra">
                                            Infra
                                        </SelectItem>
                                        <SelectItem value="Suporte">
                                            Suporte
                                        </SelectItem>
                                        <SelectItem value="Desenvolvedor">
                                            Desenvolvedor
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.responsible && (
                                <p className="text-sm text-red-500">
                                    {errors.responsible.message}
                                </p>
                            )}
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

                        <Button type="submit" disabled={isSubmitting}>
                            <Save className="w-4 h-4 mr-2" />
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