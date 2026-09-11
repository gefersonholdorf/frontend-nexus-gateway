import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useCreateDocCategoria } from "../hooks/use-create-doc-categoria";
import { CatalogoFormFields } from "./catalogo-form-fields";
import { catalogoFormSchema, type CatalogoFormValues } from "./catalogo-form-schema";

interface CreateCategoriaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: CatalogoFormValues = { ds_nome: "", ds_sigla: "", fl_ativo: true };

export function CreateCategoriaModal({ open, onOpenChange }: CreateCategoriaModalProps) {
    const { mutateAsync, isPending } = useCreateDocCategoria();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CatalogoFormValues>({
        resolver: zodResolver(catalogoFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: CatalogoFormValues) {
        await mutateAsync(values);
        reset(DEFAULT_VALUES);
        onOpenChange(false);
    }

    function handleOpenChange(next: boolean) {
        if (!next) {
            reset(DEFAULT_VALUES);
        }
        onOpenChange(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nova categoria</DialogTitle>
                    <DialogDescription>Cadastre uma nova categoria de documento.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <CatalogoFormFields register={register} errors={errors} control={control} />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Plus className="size-4" />
                            {isPending ? "Salvando..." : "Criar categoria"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
