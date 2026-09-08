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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Novo sistema/serviço</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo sistema ou serviço no Painel de Sistemas.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <HubServiceFormFields register={register} errors={errors} control={control} />

                    <DialogFooter>
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
