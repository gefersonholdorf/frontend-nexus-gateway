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

import { useUpdateModule } from "../hooks/use-update-module";
import type { CoreModule } from "../mocks/modules.mock";
import { ModuleFormFields } from "./module-form-fields";
import { moduleFormSchema, type ModuleFormValues } from "./module-form-schema";

interface EditModuleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    module: CoreModule | null;
}

/**
 * Modal de edição de módulo (RF022) — nome/descrição, mutation mockada via
 * `useUpdateModule`, sem persistência real. Status é tratado à parte pelo
 * toggle da página de detalhe. Ver docs/architecture/core-module-roadmap.md.
 */
export function EditModuleModal({ open, onOpenChange, module }: EditModuleModalProps) {
    const { mutateAsync, isPending } = useUpdateModule();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ModuleFormValues>({
        resolver: zodResolver(moduleFormSchema),
        defaultValues: {
            ds_name: "",
            ds_description: "",
        },
    });

    useEffect(() => {
        if (module) {
            reset({
                ds_name: module.ds_name,
                ds_description: module.ds_description,
            });
        }
    }, [module, reset]);

    async function onSubmit(values: ModuleFormValues) {
        if (!module) {
            return;
        }

        await mutateAsync({
            cd_id: module.cd_id,
            ds_name: values.ds_name,
            ds_description: values.ds_description,
        });

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar módulo</DialogTitle>
                    <DialogDescription>
                        Atualize os dados de {module?.ds_name ?? "módulo"}. Dado mockado, sem
                        persistência real.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <ModuleFormFields register={register} errors={errors} />

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
