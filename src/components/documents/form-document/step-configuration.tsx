import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowRight,
    BookOpen,
    ShieldCheck,
    Workflow,
} from "lucide-react";
import {
    Controller,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";
import type { CreateDocumentSchema } from ".";

interface StepConfigurationProps {
    control: Control<CreateDocumentSchema>;
    register: UseFormRegister<CreateDocumentSchema>;
    errors: FieldErrors<CreateDocumentSchema>;
    onOpenChange: (open: boolean) => void;
    onNextStep: () => void;
}

export function StepConfiguration({
    control,
    register,
    errors,
    onOpenChange,
    onNextStep,
}: StepConfigurationProps) {
    return (
        <div className="flex flex-col space-y-6 w-full">
            <div className="flex flex-col space-y-2">
                <Label>Informe a Categoria do Documento</Label>

                <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-3 gap-4"
                        >
                            <FieldLabel htmlFor="Procedimento">
                                <Field orientation="horizontal">
                                    <FieldContent className="p-1 flex flex-row items-center gap-2">
                                        <Workflow className="size-6 text-amber-500" />

                                        <div>
                                            <FieldTitle>
                                                Procedimento
                                            </FieldTitle>

                                            <FieldDescription className="text-[.8rem] text-muted-foreground">
                                                Processos, fluxos e instruções operacionais.
                                            </FieldDescription>
                                        </div>
                                    </FieldContent>

                                    <RadioGroupItem
                                        id="Procedimento"
                                        value="Procedimento"
                                    />
                                </Field>
                            </FieldLabel>

                            <FieldLabel htmlFor="Manual">
                                <Field orientation="horizontal">
                                    <FieldContent className="p-1 flex flex-row items-center gap-2">
                                        <BookOpen className="size-6 text-blue-500" />

                                        <div>
                                            <FieldTitle>
                                                Manual
                                            </FieldTitle>

                                            <FieldDescription className="text-[.8rem] text-muted-foreground">
                                                Guias de utilização de sistemas e serviços.
                                            </FieldDescription>
                                        </div>
                                    </FieldContent>

                                    <RadioGroupItem
                                        id="Manual"
                                        value="Manual"
                                    />
                                </Field>
                            </FieldLabel>

                            <FieldLabel htmlFor="Política">
                                <Field orientation="horizontal">
                                    <FieldContent className="p-1 flex flex-row items-center gap-2">
                                        <ShieldCheck className="size-6 text-emerald-500" />

                                        <div>
                                            <FieldTitle>
                                                Política
                                            </FieldTitle>

                                            <FieldDescription className="text-[.8rem] text-muted-foreground">
                                                Normas, diretrizes e regras organizacionais.
                                            </FieldDescription>
                                        </div>
                                    </FieldContent>

                                    <RadioGroupItem
                                        id="Política"
                                        value="Política"
                                    />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                    )}
                />

                {errors.category && (
                    <p className="text-sm text-red-500">
                        {errors.category.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Código</Label>

                    <Input
                        placeholder="PROC-001"
                        {...register("code")}
                    />

                    {errors.code && (
                        <p className="text-sm text-red-500">
                            {errors.code.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Documento</Label>

                    <Input
                        placeholder="Informe o título..."
                        {...register("title")}
                    />

                    {errors.title && (
                        <p className="text-sm text-red-500">
                            {errors.title.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Link do Documento em Edição</Label>

                    <Input
                        type="url"
                        placeholder="Informe a URL..."
                        {...register("viewUrl")}
                    />

                    {errors.viewUrl && (
                        <p className="text-sm text-red-500">
                            {errors.viewUrl.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Link do Documento Publicado</Label>

                    <Input
                        type="url"
                        placeholder="Informe a URL..."
                        {...register("editUrl")}
                    />

                    {errors.editUrl && (
                        <p className="text-sm text-red-500">
                            {errors.editUrl.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Status</Label>

                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Vigente">
                                            Vigente
                                        </SelectItem>

                                        <SelectItem value="Em Andamento">
                                            Em Andamento
                                        </SelectItem>

                                        <SelectItem value="Em Revisão">
                                            Em Revisão
                                        </SelectItem>

                                        <SelectItem value="Pendente">
                                            Pendente
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.status && (
                        <p className="text-sm text-red-500">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                >
                    Cancelar
                </Button>

                <Button
                    type="button"
                    onClick={onNextStep}
                >
                    Avançar
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogFooter>
        </div>
    );
}