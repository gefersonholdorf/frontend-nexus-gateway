import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
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

import { useUpdateDocCategoria } from "../hooks/use-update-doc-categoria";
import type { DocCategoria } from "../hooks/use-fetch-doc-categorias";
import { CatalogoFormFields } from "./catalogo-form-fields";
import { catalogoFormSchema, type CatalogoFormValues } from "./catalogo-form-schema";

interface EditCategoriaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoria: DocCategoria | null;
}

function toFormValues(categoria: DocCategoria | null): CatalogoFormValues {
    return {
        ds_nome: categoria?.ds_nome ?? "",
        ds_sigla: categoria?.ds_sigla ?? "",
        fl_ativo: categoria?.fl_ativo ?? true,
    };
}

export function EditCategoriaModal({ open, onOpenChange, categoria }: EditCategoriaModalProps) {
    const { mutateAsync, isPending } = useUpdateDocCategoria();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CatalogoFormValues>({
        resolver: zodResolver(catalogoFormSchema),
        defaultValues: toFormValues(categoria),
    });

    useEffect(() => {
        if (open) {
            reset(toFormValues(categoria));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, categoria]);

    async function onSubmit(values: CatalogoFormValues) {
        if (!categoria) {
            return;
        }

        await mutateAsync({ cd_id: categoria.cd_id, ...values });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar categoria</DialogTitle>
                    <DialogDescription>Atualize os dados da categoria.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <CatalogoFormFields register={register} errors={errors} control={control} />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Save className="size-4" />
                            {isPending ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
