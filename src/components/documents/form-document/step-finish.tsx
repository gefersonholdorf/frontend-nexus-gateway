import { useGetProfilesSelect } from "@/api/profiles/get-select-profiles";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Save, X } from "lucide-react";
import {
    type Control,
    type UseFormHandleSubmit,
    useWatch,
} from "react-hook-form";
import type { CreateDocumentSchema } from ".";

interface StepFinishProps {
    mode?: "create" | "update";
    control: Control<CreateDocumentSchema>;
    onPrevStep: () => void;
    onOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    onIsPending: boolean
    handleSubmit: UseFormHandleSubmit<CreateDocumentSchema>;
    onSubmit: (data: CreateDocumentSchema) => Promise<void>;
}

export function StepFinish({
    mode,
    control,
    onPrevStep,
    onOpenChange,
    isSubmitting,
    onIsPending,
    handleSubmit,
    onSubmit
}: StepFinishProps) {
    const values = useWatch({ control });

    const { data } = useGetProfilesSelect();

    const selectedProfiles =
        data?.profiles.filter((profile) =>
            values.profiles?.includes(profile.id)
        ) ?? [];

    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    Revisão do Documento
                </h3>

                <p className="text-sm text-muted-foreground">
                    Confira as informações antes de concluir o cadastro.
                </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">

                <div className="space-y-4">

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Código
                        </p>
                        <p className="font-medium">
                            {values.code}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Documento
                        </p>
                        <p className="font-medium">
                            {values.title}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Categoria
                        </p>
                        <p className="font-medium">
                            {values.category}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Status
                        </p>
                        <p className="font-medium">
                            {values.status}
                        </p>
                    </div>

                </div>

                <div className="space-y-4">

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Documento em edição
                        </p>

                        <p className="font-medium break-all">
                            {values.viewUrl || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Documento publicado
                        </p>

                        <p className="font-medium break-all">
                            {values.editUrl || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground mb-2">
                            Perfis com acesso
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {selectedProfiles.length > 0 ? (
                                selectedProfiles.map((profile) => (
                                    <span
                                        key={profile.id}
                                        className="rounded-md border bg-muted px-3 py-1 text-sm"
                                    >
                                        {profile.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    Nenhum perfil selecionado
                                </span>
                            )}
                        </div>
                    </div>

                </div>

            </div>

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                >
                    <X />
                    Cancelar
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        onPrevStep()
                    }}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>

                <Button
                    type="button"
                    onClick={handleSubmit(
                        onSubmit,
                        (errors) => {
                            console.log("Erros de validação:", errors);
                        }
                    )}
                    disabled={isSubmitting || onIsPending}
                >   
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting || onIsPending
                        ? "Salvando..."
                        : mode === 'create' ? "Criar Documento" : "Atualizar Documento"}
                </Button>
            </DialogFooter>
        </div>
    );
}