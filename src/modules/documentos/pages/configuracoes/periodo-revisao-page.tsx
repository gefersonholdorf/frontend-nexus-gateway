import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Can } from "@/modules/auth/components/can";

import { useFetchDocConfiguracoes } from "../../hooks/use-fetch-doc-configuracoes";
import { useUpdateDocConfiguracoes } from "../../hooks/use-update-doc-configuracoes";

const schema = z.object({
    ds_periodo_revisao_dias: z
        .string()
        .trim()
        .refine((value) => value !== "" && Number.isInteger(Number(value)) && Number(value) > 0, {
            message: "Informe um número de dias válido (maior que zero).",
        })
        .transform((value) => Number(value)),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.infer<typeof schema>;

/**
 * `GET/PUT /documentos/configuracoes` (RF024/RN023) — período de revisão
 * automática global, linha singleton, default 365 dias.
 */
export function PeriodoRevisaoPage() {
    const { data: configuracoes, isLoading } = useFetchDocConfiguracoes();
    const { mutateAsync, isPending } = useUpdateDocConfiguracoes();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInput, unknown, FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ds_periodo_revisao_dias: "365" },
    });

    useEffect(() => {
        if (configuracoes) {
            reset({ ds_periodo_revisao_dias: String(configuracoes.ds_periodo_revisao_dias) });
        }
    }, [configuracoes, reset]);

    async function onSubmit(values: FormValues) {
        await mutateAsync(values);
    }

    return (
        <>
            <HeaderPage
                title="Período de revisão"
                description="Periodicidade da abertura automática de revisão, contada a partir da última aprovação (RN023)."
                icon={CalendarClock}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/gestao-documentos">Documentos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Período de revisão</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <Card className="max-w-lg p-5">
                    <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-base">Configuração global</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Carregando...</p>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ds_periodo_revisao_dias">Período (dias)</Label>
                                    <Input
                                        id="ds_periodo_revisao_dias"
                                        type="number"
                                        min={1}
                                        {...register("ds_periodo_revisao_dias")}
                                    />
                                    {errors.ds_periodo_revisao_dias && (
                                        <span className="text-sm text-destructive">
                                            {errors.ds_periodo_revisao_dias.message}
                                        </span>
                                    )}
                                </div>

                                <Can permission="configuracoes.gerenciar" fallback={null}>
                                    <Button type="submit" disabled={isPending}>
                                        <Save className="size-4" />
                                        {isPending ? "Salvando..." : "Salvar"}
                                    </Button>
                                </Can>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
