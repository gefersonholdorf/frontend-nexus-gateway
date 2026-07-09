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

import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { useUpdateDocument } from "@/api/documents/update-document";

interface Document {
    id: number;
    code: string;
    title: string;
    category: string;
    status: string;
    url: string;
    responsible: string;
}

interface EditDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document?: Document | null;
}

const editDocumentSchema = z.object({
    code: z.string().min(1, "Código obrigatório"),
    title: z.string().min(1, "Título obrigatório"),
    category: z.string().min(1, "Categoria obrigatória"),
    status: z.string().min(1, "Status obrigatório"),
    url: z.url("URL inválida"),
    responsible: z.string().min(1, "Responsável obrigatório"),
});

type EditDocumentSchema = z.infer<typeof editDocumentSchema>;

export function EditDocumentModal({
    open,
    onOpenChange,
    document,
}: EditDocumentModalProps) {
    const [formError, setFormError] = useState<string | null>(null);
    const { mutateAsync, isPending } = useUpdateDocument();
    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
    } = useForm<EditDocumentSchema>({
        resolver: zodResolver(editDocumentSchema),
    });

    useEffect(() => {
        if (document && open) {
            reset({
                code: document.code,
                title: document.title,
                category: document.category,
                status: document.status,
                url: document.url,
                responsible: document.responsible,
            });
        }
    }, [document, open, reset]);
    async function handleEditDocumentSubmit(
        data: EditDocumentSchema
    ) {

        if (!document) return;
        try {
            setFormError(null);
            await mutateAsync({
                id: document.id,
                ...data
            });
            toast.success(
                "Documento atualizado com sucesso!",
                {
                    position: "top-center",
                    richColors: true,
                }
            );


            reset();
            onOpenChange(false);


        } catch (error) {

            console.error(error);

            setFormError(
                "Erro ao atualizar documento."
            );


            toast.error(
                "Erro ao atualizar documento.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );

        }

    }



    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="max-w-2xl p-0 overflow-hidden">


                <DialogHeader className="border-b bg-muted/40 p-6">

                    <DialogTitle>
                        Editar Documento
                    </DialogTitle>


                    <DialogDescription>
                        Atualize as informações do documento.
                    </DialogDescription>

                </DialogHeader>



                <form
                    onSubmit={
                        handleSubmit(handleEditDocumentSubmit)
                    }
                    className="space-y-6 p-6"
                >


                    {
                        formError && (
                            <p className="text-sm text-red-500">
                                {formError}
                            </p>
                        )
                    }



                    <div className="grid grid-cols-2 gap-4">


                        <div className="space-y-2">

                            <Label>
                                Código
                            </Label>


                            <Input
                                {...register("code")}
                            />


                            {
                                errors.code &&
                                <p className="text-sm text-red-500">
                                    {errors.code.message}
                                </p>
                            }

                        </div>



                        <div className="space-y-2">

                            <Label>
                                Documento
                            </Label>


                            <Input
                                {...register("title")}
                            />


                            {
                                errors.title &&
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            }

                        </div>


                    </div>




                    <div className="grid grid-cols-2 gap-4">


                        <div className="space-y-2">

                            <Label>
                                Categoria
                            </Label>


                            <Select
                                value={undefined}
                                onValueChange={(value) =>
                                    setValue(
                                        "category",
                                        value,
                                        {
                                            shouldValidate: true
                                        }
                                    )
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


                            {
                                errors.category &&
                                <p className="text-sm text-red-500">
                                    {errors.category.message}
                                </p>
                            }


                        </div>





                        <div className="space-y-2">

                            <Label>
                                Status
                            </Label>


                            <Select

                                onValueChange={(value) =>
                                    setValue(
                                        "status",
                                        value,
                                        {
                                            shouldValidate: true
                                        }
                                    )
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


                            {
                                errors.status &&
                                <p className="text-sm text-red-500">
                                    {errors.status.message}
                                </p>
                            }


                        </div>


                    </div>




                    <div className="grid grid-cols-2 gap-4">


                        <div className="space-y-2">

                            <Label>
                                Localização do Documento
                            </Label>


                            <Input
                                {...register("url")}
                            />


                            {
                                errors.url &&
                                <p className="text-sm text-red-500">
                                    {errors.url.message}
                                </p>
                            }


                        </div>




                        <div className="space-y-2">


                            <Label>
                                Responsável
                            </Label>



                            <Select

                                onValueChange={(value) =>
                                    setValue(
                                        "responsible",
                                        value,
                                        {
                                            shouldValidate: true
                                        }
                                    )
                                }

                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>


                                <SelectContent>

                                    <SelectGroup>

                                        <SelectItem value="RH">
                                            RH
                                        </SelectItem>

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


                            {
                                errors.responsible &&
                                <p className="text-sm red-500">
                                    {errors.responsible.message}
                                </p>
                            }


                        </div>


                    </div>





                    <DialogFooter>


                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onOpenChange(false);
                            }}
                        >
                            Cancelar
                        </Button>



                        <Button
                            type="submit"
                            disabled={
                                isSubmitting || isPending
                            }
                        >

                            <Save className="w-4 h-4 mr-2" />


                            {
                                isPending
                                    ? "Salvando..."
                                    : "Salvar Alterações"
                            }


                        </Button>


                    </DialogFooter>


                </form>


            </DialogContent>


        </Dialog>
    );
}