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

import { useUpdateHubService } from "../hooks/use-update-hub-service";
import type { HubService } from "../hooks/use-fetch-hub-services";
import { HubServiceFormFields } from "./hub-service-form-fields";
import {
    hubServiceFormSchema,
    type HubServiceFormInput,
    type HubServiceFormValues,
} from "./hub-service-form-schema";

interface EditHubServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hubService: HubService | null;
}

const EMPTY_VALUES: HubServiceFormInput = {
    st_type: "SYSTEM",
    st_environment: "PROD",
    ds_title: "",
    ds_description: "",
    ds_access_url: "",
    ds_ip: "",
    ds_port: "",
    ds_status_url: "",
    st_status_check_method: "GET",
    ds_status_check_headers: [],
    st_status_check_auth_type: "NONE",
    status_check_auth_token: "",
    status_check_auth_header_name: "",
    status_check_auth_header_value: "",
    status_check_auth_username: "",
    status_check_auth_password: "",
    ds_status_check_body: "",
};

/**
 * Modal de edição de sistema/serviço (RF003) — `useUpdateHubService` chama
 * `PUT /hub-services/{id}`.
 */
export function EditHubServiceModal({ open, onOpenChange, hubService }: EditHubServiceModalProps) {
    const { mutateAsync, isPending } = useUpdateHubService();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<HubServiceFormInput, unknown, HubServiceFormValues>({
        resolver: zodResolver(hubServiceFormSchema),
        defaultValues: EMPTY_VALUES,
    });

    useEffect(() => {
        if (hubService) {
            reset({
                st_type: hubService.st_type,
                st_environment: hubService.st_environment,
                ds_title: hubService.ds_title,
                ds_description: hubService.ds_description,
                ds_access_url: hubService.ds_access_url ?? "",
                ds_ip: hubService.ds_ip ?? "",
                ds_port: hubService.ds_port != null ? String(hubService.ds_port) : "",
                ds_status_url: hubService.ds_status_url ?? "",
                st_status_check_method: hubService.st_status_check_method ?? "GET",
                ds_status_check_headers: hubService.ds_status_check_headers ?? [],
                // O backend nunca retorna o segredo em texto puro (mascarado) —
                // só o tipo de autenticação configurado é reaproveitado aqui.
                // As credenciais precisam ser reinformadas para serem mantidas
                // ou alteradas (ver aviso exibido junto ao campo no formulário).
                st_status_check_auth_type: hubService.st_status_check_auth_type ?? "NONE",
                status_check_auth_token: "",
                status_check_auth_header_name: "",
                status_check_auth_header_value: "",
                status_check_auth_username: "",
                status_check_auth_password: "",
                ds_status_check_body: hubService.ds_status_check_body ?? "",
            });
        }
    }, [hubService, reset]);

    async function onSubmit(values: HubServiceFormValues) {
        if (!hubService) {
            return;
        }

        await mutateAsync({ cd_id: hubService.cd_id, ...values });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Editar sistema/serviço</DialogTitle>
                    <DialogDescription>
                        Atualize os dados de {hubService?.ds_title ?? "sistema/serviço"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
                        <HubServiceFormFields
                            register={register}
                            errors={errors}
                            control={control}
                            setValue={setValue}
                        />
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
