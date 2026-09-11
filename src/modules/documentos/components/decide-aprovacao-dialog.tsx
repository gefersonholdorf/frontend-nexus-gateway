import { zodResolver } from "@hookform/resolvers/zod";
import { Gavel } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useDecideAprovacao } from "../hooks/use-decide-aprovacao";

const schema = z
    .object({
        ds_decisao: z.enum(["APROVAR", "REPROVAR", "AJUSTE_SOLICITADO"], {
            message: "Selecione a decisão.",
        }),
        ds_justificativa: z.string().trim().optional(),
        ds_url_publicacao: z.string().trim().optional(),
    })
    .superRefine((values, ctx) => {
        // RN024/Cenário 5: justificativa obrigatória em reprovar/ajuste.
        if (
            (values.ds_decisao === "REPROVAR" || values.ds_decisao === "AJUSTE_SOLICITADO") &&
            !values.ds_justificativa
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["ds_justificativa"],
                message: "Informe a justificativa para prosseguir.",
            });
        }
    });

type FormValues = z.infer<typeof schema>;

interface DecideAprovacaoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentoId: number;
    revisaoId: number;
    aprovacaoId: number;
}

/**
 * `POST .../aprovacoes/:aprovacaoId/decidir` (RF018/RF019). `ds_url_publicacao`
 * só é obrigatória quando esta decisão completa a última etapa do fluxo
 * (Cenário 6) — como isso depende também das decisões paralelas de outros
 * aprovadores da mesma etapa (RN016), o campo fica sempre disponível e
 * opcional aqui; se faltar quando necessário, o backend recusa com 400 e a
 * mensagem aparece via toast.
 */
export function DecideAprovacaoDialog({
    open,
    onOpenChange,
    documentoId,
    revisaoId,
    aprovacaoId,
}: DecideAprovacaoDialogProps) {
    const { mutateAsync, isPending } = useDecideAprovacao(documentoId);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ds_decisao: "APROVAR", ds_justificativa: "", ds_url_publicacao: "" },
    });

    const decisao = useWatch({ control, name: "ds_decisao" });

    async function onSubmit(values: FormValues) {
        await mutateAsync({
            revisaoId,
            aprovacaoId,
            ds_decisao: values.ds_decisao,
            ds_justificativa: values.ds_justificativa || undefined,
            ds_url_publicacao: values.ds_url_publicacao || undefined,
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
                        <Gavel className="size-4 text-primary" aria-hidden="true" />
                        Decidir aprovação
                    </DialogTitle>
                    <DialogDescription>
                        Aprovar avança para a próxima etapa (ou publica, se for a última);
                        reprovar encerra o fluxo; solicitar ajuste retorna à revisão (RF018).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ds_decisao">Decisão</Label>
                        <Controller
                            control={control}
                            name="ds_decisao"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger id="ds_decisao" className="w-full">
                                        <SelectValue placeholder="Selecione a decisão" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="APROVAR">Aprovar</SelectItem>
                                        <SelectItem value="REPROVAR">Reprovar</SelectItem>
                                        <SelectItem value="AJUSTE_SOLICITADO">Solicitar ajuste</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ds_decisao && (
                            <span className="text-sm text-destructive">{errors.ds_decisao.message}</span>
                        )}
                    </div>

                    {(decisao === "REPROVAR" || decisao === "AJUSTE_SOLICITADO") && (
                        <div className="space-y-2">
                            <Label htmlFor="ds_justificativa">Justificativa</Label>
                            <Textarea
                                id="ds_justificativa"
                                placeholder="Descreva o motivo"
                                {...register("ds_justificativa")}
                            />
                            {errors.ds_justificativa && (
                                <span className="text-sm text-destructive">
                                    {errors.ds_justificativa.message}
                                </span>
                            )}
                        </div>
                    )}

                    {decisao === "APROVAR" && (
                        <div className="space-y-2">
                            <Label htmlFor="ds_url_publicacao">URL de publicação</Label>
                            <Input
                                id="ds_url_publicacao"
                                placeholder="https://..."
                                {...register("ds_url_publicacao")}
                            />
                            <p className="text-xs text-muted-foreground">
                                Obrigatória apenas se esta for a última aprovação necessária antes da
                                publicação (RF019).
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enviando..." : "Confirmar decisão"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
