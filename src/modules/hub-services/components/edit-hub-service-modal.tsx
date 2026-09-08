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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar sistema/serviço</DialogTitle>
                    <DialogDescription>
                        Atualize os dados de {hubService?.ds_title ?? "sistema/serviço"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <HubServiceFormFields register={register} errors={errors} control={control} />

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
