import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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

import { useCreateHubService } from "../hooks/use-create-hub-service";
import { HubServiceFormFields } from "./hub-service-form-fields";
import {
    hubServiceFormSchema,
    type HubServiceFormInput,
    type HubServiceFormValues,
} from "./hub-service-form-schema";

interface CreateHubServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: HubServiceFormInput = {
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
 * Modal de criação de sistema/serviço (RF002) — `useCreateHubService` chama
 * `POST /hub-services`.
 */
export function CreateHubServiceModal({ open, onOpenChange }: CreateHubServiceModalProps) {
    const { mutateAsync, isPending } = useCreateHubService();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<HubServiceFormInput, unknown, HubServiceFormValues>({
        resolver: zodResolver(hubServiceFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    async function onSubmit(values: HubServiceFormValues) {
        await mutateAsync(values);
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
            <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Novo sistema/serviço</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo sistema ou serviço no Painel de Sistemas.
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
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Plus className="size-4" />
                            {isPending ? "Salvando..." : "Cadastrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
