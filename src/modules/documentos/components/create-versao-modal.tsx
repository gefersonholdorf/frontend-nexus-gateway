import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCreateVersao } from "../hooks/use-create-versao";

const schema = z.object({
    ds_descritivo: z.string().trim().min(1, "Informe o descritivo da versão."),
    ds_url_edicao: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateVersaoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentoId: number;
    /** URL de edição da versão anterior, pré-carregada por padrão (RF012). */
    urlEdicaoAnterior?: string;
}

/**
 * `POST /documentos/:id/versoes` (RF010/RF012). Se `ds_url_edicao` for
 * deixado igual ao pré-carregado (ou vazio), o backend preenche com o
 * default da versão anterior.
 */
export function CreateVersaoModal({
    open,
    onOpenChange,
    documentoId,
    urlEdicaoAnterior,
}: CreateVersaoModalProps) {
    const { mutateAsync, isPending } = useCreateVersao(documentoId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ds_descritivo: "", ds_url_edicao: urlEdicaoAnterior ?? "" },
    });

    useEffect(() => {
        if (open) {
            reset({ ds_descritivo: "", ds_url_edicao: urlEdicaoAnterior ?? "" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, urlEdicaoAnterior]);

    async function onSubmit(values: FormValues) {
        await mutateAsync({
            ds_descritivo: values.ds_descritivo,
            ds_url_edicao: values.ds_url_edicao || undefined,
        });
        reset();
        onOpenChange(false);
    }

    function handleOpenChange(next: boolean) {
        if (!next) {
            reset();
        }
        onOpenChange(next);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FilePlus className="size-4 text-primary" aria-hidden="true" />
                        Nova versão
                    </DialogTitle>
                    <DialogDescription>
                        Cada nova versão incrementa o minor da versão (RN010).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ds_descritivo">Descritivo</Label>
                        <Textarea
                            id="ds_descritivo"
                            placeholder="O que mudou nesta versão"
                            {...register("ds_descritivo")}
                        />
                        {errors.ds_descritivo && (
                            <span className="text-sm text-destructive">
                                {errors.ds_descritivo.message}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ds_url_edicao">URL de edição</Label>
                        <Input
                            id="ds_url_edicao"
                            placeholder="https://..."
                            {...register("ds_url_edicao")}
                        />
                        {errors.ds_url_edicao && (
                            <span className="text-sm text-destructive">
                                {errors.ds_url_edicao.message}
                            </span>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Salvando..." : "Criar versão"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
