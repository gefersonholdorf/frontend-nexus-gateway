import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
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

import { useCreateDocumento } from "../hooks/use-create-documento";
import { DocumentoFormFields } from "./documento-form-fields";
import { documentoFormSchema, type DocumentoFormValues } from "./documento-form-schema";

interface CreateDocumentoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: DocumentoFormValues = {
    ds_titulo: "",
    ds_descricao: "",
    cd_categoria: 0,
    cd_area: 0,
    st_modo_codigo: "AUTOMATICO",
    ds_codigo: "",
    cd_responsavel: 0,
    roles: [],
    cd_fluxo_aprovacao: undefined,
};

/**
 * Modal de criação de documento (RF001) — `useCreateDocumento` chama
 * `POST /documentos`. Erros 400 do backend (Cenário 1: código; Cenário 8:
 * responsável sem role) chegam como `ApiError` e são exibidos via toast.
 */
export function CreateDocumentoModal({ open, onOpenChange }: CreateDocumentoModalProps) {
    const { mutateAsync, isPending } = useCreateDocumento();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<DocumentoFormValues>({
        resolver: zodResolver(documentoFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: DocumentoFormValues) {
        await mutateAsync({
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
            <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Novo documento</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo documento. Ele nasce em Rascunho, versão 0.1 (RF005).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
                        <DocumentoFormFields register={register} errors={errors} control={control} />
                    </div>

                    <DialogFooter className="border-t p-6">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <FilePlus2 className="size-4" />
                            {isPending ? "Salvando..." : "Cadastrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
