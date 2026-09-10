import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { Loader2, Plug, RefreshCw, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { Can } from "@/modules/auth/components/can";
import { useHasPermission } from "@/modules/providers/permission-provider";

import { useTestIntegrationConnection } from "../hooks/use-test-integration-connection";
import { useUpdateIntegration } from "../hooks/use-update-integration";
import type { CoreIntegration } from "../hooks/use-fetch-integrations";
import { MonoValue } from "./core-mono-value";
import { StatusDot } from "./core-status-dot";
import { IntegrationFormFields } from "./integration-form-fields";
import { integrationFormSchema, type IntegrationFormValues } from "./integration-form-schema";

interface IntegrationDetailsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    integration: CoreIntegration | null;
}

/**
 * "Página de detalhe" + edição da integração (RF025/RF026) — como não existe
 * rota `/core/integrations/:id`, ambos são resolvidos aqui, num `Drawer`
 * aberto a partir do card. `ds_config` é exibido/editado dinamicamente a
 * partir das chaves retornadas pela API; `ds_secret` é exibido exatamente
 * como recebido — já vem mascarado do backend (RN005), então o frontend não
 * implementa nenhuma lógica própria de mascaramento/revelação. "Testar
 * Conexão" (RF027) mostra o resultado mais recente e o timestamp do último
 * teste. Ações de escrita ficam desabilitadas/ocultas sem
 * `integrations.manage`.
 */
export function IntegrationDetailsDrawer({
    open,
    onOpenChange,
    integration,
}: IntegrationDetailsDrawerProps) {
    const { mutateAsync: updateIntegration, isPending: isSaving } = useUpdateIntegration();
    const { mutate: testConnection, isPending: isTesting } = useTestIntegrationConnection();
    const canManage = useHasPermission("integrations.manage");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IntegrationFormValues>({
        resolver: zodResolver(integrationFormSchema),
        defaultValues: { ds_name: "", ds_description: "", ds_config: {} },
    });

    useEffect(() => {
        if (integration) {
            reset({
                ds_name: integration.ds_name,
                ds_description: integration.ds_description,
                ds_config: { ...integration.ds_config },
            });
        }
    }, [integration, reset]);

    async function onSubmit(values: IntegrationFormValues) {
        if (!integration) {
            return;
        }

        await updateIntegration({
            cd_id: integration.cd_id,
            ds_name: values.ds_name,
            ds_description: values.ds_description,
            ds_config: values.ds_config,
        });
    }

    function handleTestConnection() {
        if (!integration) {
            return;
        }

        testConnection({ cd_id: integration.cd_id });
    }

    const configKeys = integration ? Object.keys(integration.ds_config) : [];

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex h-full flex-col sm:max-w-lg">
                <DrawerHeader className="border-b border-border/60 text-left">
                    <DrawerTitle className="flex items-center gap-2">
                        <Plug className="size-4 text-core-signal" aria-hidden="true" />
                        {integration?.ds_name ?? "Integração"}
                    </DrawerTitle>
                    <DrawerDescription>
                        Tipo <MonoValue>{integration?.ds_type ?? "-"}</MonoValue>
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Status da conexão</p>
                            {integration && (
                                <StatusDot
                                    tone={integration.st_status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                                    label={
                                        integration.st_status === "ACTIVE"
                                            ? "Conectado"
                                            : "Falha na conexão"
                                    }
                                />
                            )}
                            {integration?.dt_last_tested_at && (
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    Último teste:{" "}
                                    <MonoValue>
                                        {formatDate(
                                            new Date(integration.dt_last_tested_at),
                                            "dd/MM/yyyy HH:mm",
                                        )}
                                    </MonoValue>
                                </p>
                            )}
                        </div>

                        <Can permission="integrations.manage" fallback={null}>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isTesting || !integration}
                                onClick={handleTestConnection}
                            >
                                {isTesting ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="size-4" />
                                )}
                                Testar conexão
                            </Button>
                        </Can>
                    </div>

                    <form id="integration-edit-form" onSubmit={handleSubmit(onSubmit)}>
                        <fieldset disabled={!canManage} className="space-y-4">
                            <IntegrationFormFields
                                register={register}
                                errors={errors}
                                configKeys={configKeys}
                            />
                        </fieldset>
                    </form>

                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-foreground">Segredo</p>
                        {/*
                            RN005: o backend nunca retorna o segredo em texto claro — este
                            valor já vem mascarado da API. O frontend apenas exibe
                            `ds_secret` como recebido, sem lógica própria de
                            mascaramento/revelação.
                        */}
                        <div className="flex items-center gap-2 rounded-md border border-border/60 p-2.5">
                            <MonoValue className="flex-1 truncate">{integration?.ds_secret}</MonoValue>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t border-border/60 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                    <Can permission="integrations.manage" fallback={null}>
                        <Button type="submit" form="integration-edit-form" disabled={isSaving}>
                            <Save className="size-4" />
                            {isSaving ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </Can>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
