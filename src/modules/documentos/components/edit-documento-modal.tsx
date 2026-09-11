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

import { useUpdateDocumento } from "../hooks/use-update-documento";
import type { DocumentoDetail } from "../hooks/use-fetch-documento-by-id";
import { DocumentoFormFields } from "./documento-form-fields";
import { documentoFormSchema, type DocumentoFormValues } from "./documento-form-schema";

interface EditDocumentoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documento: DocumentoDetail | null;
}

function toFormValues(documento: DocumentoDetail | null): DocumentoFormValues {
    return {
        ds_titulo: documento?.ds_titulo ?? "",
        ds_descricao: documento?.ds_descricao ?? "",
        cd_categoria: documento?.cd_categoria ?? 0,
        cd_area: documento?.cd_area ?? 0,
        st_modo_codigo: documento?.st_modo_codigo ?? "AUTOMATICO",
        ds_codigo: documento?.ds_codigo ?? "",
        cd_responsavel: documento?.cd_responsavel ?? 0,
        roles: documento?.roles.map((role) => role.cd_id) ?? [],
        cd_fluxo_aprovacao: documento?.cd_fluxo_aprovacao ?? undefined,
    };
}

/**
 * Modal de edição de documento (RF001) — `useUpdateDocumento` chama
 * `PUT /documentos/:id`. Alterar categoria/área recalcula o código
 * incondicionalmente no backend (RN005).
 */
export function EditDocumentoModal({ open, onOpenChange, documento }: EditDocumentoModalProps) {
    const { mutateAsync, isPending } = useUpdateDocumento();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<DocumentoFormValues>({
        resolver: zodResolver(documentoFormSchema),
        defaultValues: toFormValues(documento),
    });

    useEffect(() => {
        if (open) {
            reset(toFormValues(documento));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, documento]);

    async function onSubmit(values: DocumentoFormValues) {
        if (!documento) {
            return;
        }

        await mutateAsync({
            cd_id: documento.cd_id,
            ds_titulo: values.ds_titulo,
            ds_descricao: values.ds_descricao,
            cd_categoria: values.cd_categoria,
            cd_area: values.cd_area,
            st_modo_codigo: values.st_modo_codigo,
            ds_codigo: values.st_modo_codigo === "MANUAL" ? values.ds_codigo : undefined,
            cd_responsavel: values.cd_responsavel,
            roles: values.roles,
            cd_fluxo_aprovacao: values.cd_fluxo_aprovacao,
        });

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Editar documento</DialogTitle>
                    <DialogDescription>Atualize os dados mestres do documento.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
                        <DocumentoFormFields register={register} errors={errors} control={control} />
                    </div>

                    <DialogFooter className="border-t p-6">
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
