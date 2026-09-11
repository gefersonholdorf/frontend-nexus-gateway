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

import { useUpdateDocArea } from "../hooks/use-update-doc-area";
import type { DocArea } from "../hooks/use-fetch-doc-areas";
import { CatalogoFormFields } from "./catalogo-form-fields";
import { catalogoFormSchema, type CatalogoFormValues } from "./catalogo-form-schema";

interface EditAreaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    area: DocArea | null;
}

function toFormValues(area: DocArea | null): CatalogoFormValues {
    return {
        ds_nome: area?.ds_nome ?? "",
        ds_sigla: area?.ds_sigla ?? "",
        fl_ativo: area?.fl_ativo ?? true,
    };
}

export function EditAreaModal({ open, onOpenChange, area }: EditAreaModalProps) {
    const { mutateAsync, isPending } = useUpdateDocArea();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CatalogoFormValues>({
        resolver: zodResolver(catalogoFormSchema),
        defaultValues: toFormValues(area),
    });

    useEffect(() => {
        if (open) {
            reset(toFormValues(area));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, area]);

    async function onSubmit(values: CatalogoFormValues) {
        if (!area) {
            return;
        }

        await mutateAsync({ cd_id: area.cd_id, ...values });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar área</DialogTitle>
                    <DialogDescription>Atualize os dados da área.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <CatalogoFormFields
                        register={register}
                        errors={errors}
                        control={control}
                        siglaPlaceholder="Ex.: INFRA"
                    />

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
