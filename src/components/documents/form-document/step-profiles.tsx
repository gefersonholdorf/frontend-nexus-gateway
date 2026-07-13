import { useGetProfilesSelect } from "@/api/profiles/get-select-profiles";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Code2, Headset, Server, ShieldCheck, UserCog, X } from "lucide-react";
import {
    Controller,
    type Control,
    type FieldErrors,
} from "react-hook-form";
import type { CreateDocumentSchema } from ".";

interface StepProfilesProps {
    control: Control<CreateDocumentSchema>;
    errors: FieldErrors<CreateDocumentSchema>;
    onOpenChange: (open: boolean) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
}

export function StepProfiles({
    control,
    errors,
    onOpenChange,
    onNextStep,
    onPrevStep,
}: StepProfilesProps) {
    const { data, isLoading, isError } = useGetProfilesSelect();

    return (
        <div className="flex flex-col space-y-6 w-full">
            <div className="flex flex-col space-y-2">
                <Label>Selecione os Perfis de Acesso</Label>
            </div>

            {isLoading ? (
                <p>Carregando perfis...</p>
            ) : isError ? (
                <p>Erro ao carregar perfis.</p>
            ) : (
                <Controller
                    control={control}
                    name="profiles"
                    defaultValue={[]}
                    render={({ field }) => (
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-4">
                                {data?.profiles.map((profile) => {
                                    const checked = field.value?.includes(profile.id);

                                    return (
                                        <FieldLabel
                                            key={profile.id}
                                            htmlFor={`profile-${profile.id}`}
                                        >
                                            <Field orientation="horizontal">
                                                <FieldContent className="flex flex-row items-center gap-3">
                                                    <div>
                                                        {profile.name === 'Desenvolvedor' && <Code2 className="size-5 text-purple-500" />}
                                                        {profile.name === 'Administrador' && <ShieldCheck className="size-5 text-amber-500" />}
                                                        {profile.name === 'Infraestrutura' && <Server className="size-5 text-blue-500" />}
                                                        {profile.name === 'Suporte' && <Headset className="size-5 text-emerald-500" />}
                                                        {!["Desenvolvedor", "Administrador", "Infraestrutura", "Suporte"].includes(profile.name) && (
                                                            <UserCog className="size-5 text-slate-500" />
                                                        )}
                                                    </div>


                                                    <div>
                                                        <FieldTitle>
                                                            {profile.name}
                                                        </FieldTitle>

                                                        <FieldDescription>
                                                            {profile.description ?? "Sem descrição"}
                                                        </FieldDescription>
                                                    </div>
                                                </FieldContent>

                                                <Checkbox
                                                    id={`profile-${profile.id}`}
                                                    checked={checked}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange([
                                                                ...(field.value ?? []),
                                                                profile.id,
                                                            ]);
                                                        } else {
                                                            field.onChange(
                                                                (field.value ?? []).filter(
                                                                    (id: number) =>
                                                                        id !== profile.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Field>
                                        </FieldLabel>
                                    );
                                })}
                            </div>

                            {errors.profiles && (
                                <p className="text-sm text-red-500">
                                    {errors.profiles.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            )}

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                >
                    <X />
                    Cancelar
                </Button>

                <Button type="button" onClick={onPrevStep} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>

                <Button type="button" onClick={onNextStep}>
                    Avançar
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogFooter>
        </div>
    );
}