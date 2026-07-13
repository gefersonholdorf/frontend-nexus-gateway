import {
    Stepper,
    StepperContent,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperSeparator,
    StepperTitle,
    StepperTrigger
} from "@/components/reui/stepper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { StepConfiguration } from "./step-configuration";
import { StepFinish } from "./step-finish";
import { StepProfiles } from "./step-profiles";

const steps = [
    { title: "Configuração", description: "Adicione as configurações básicas do documento" },
    { title: "Perfis", description: "Adicione os Perfis que irão visualizar este documento" },
    { title: "Finalização", description: "Revise e Cadastre seu Documento" },
]

interface CreateDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "update";
    defaultValues?: Partial<CreateDocumentSchema>;

    onSubmit: (data: CreateDocumentSchema) => Promise<void>;

    isPending: boolean;
}

const nullableUrl = z
  .string()
  .nullable()
  .transform((value) => {
    if (value === "") return null;
    return value;
  })
  .refine(
    (value) => value === null || z.url().safeParse(value).success,
    { message: "URL inválida" }
  );

const createDocumentSchema = z.object({
    code: z.string().min(1, "Código obrigatório"),
    title: z.string().min(1, "Título obrigatório"),
    category: z.string().min(1, "Categoria obrigatória"),
    status: z.string().min(1, "Status obrigatório"),

    viewUrl: nullableUrl,
    editUrl: nullableUrl,

    profiles: z.array(z.number()).min(1, "Selecione pelo menos um perfil"),
});

export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>;

export function DocumentFormModal({
    open,
    onOpenChange,
    onSubmit,
    defaultValues,
    isPending,
    mode
}: CreateDocumentModalProps) {
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        reset,
        control,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<CreateDocumentSchema>({
        resolver: zodResolver(createDocumentSchema),
        defaultValues: {
            code: "",
            category: "",
            status: "",
            title: "",
            viewUrl: null,
            editUrl: null,
            profiles: [],
            ...defaultValues,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                code: "",
                category: "",
                status: "",
                title: "",
                viewUrl: null,
                editUrl: null,
                profiles: [],
                ...defaultValues,
            });

            setStep(1);
        }
    }, [open, defaultValues, reset]);

    async function handleNextStep() {
        let isValid = true;

        if (step === 1) {
            isValid = await trigger([
                "code",
                "title",
                "category",
                "status",
                "editUrl",
                "viewUrl"
            ]);
        }

        if (step === 2) {
            isValid = await trigger([
                "profiles",
            ]);
        }

        if (!isValid) {
            return;
        }

        if (step === steps.length) {
            handleSubmit(handleDocumentSubmit)
            return;
        }

        setStep((prev) => prev + 1);
    }

    function handlePrevStep() {
        if (step === 1) {
            onOpenChange(false);
            return;
        }
        setStep((prev) => prev - 1);
    }

    async function handleDocumentSubmit(data: CreateDocumentSchema) {
        try {
            await onSubmit({
                ...data,
                viewUrl: data.viewUrl === "" ? null : data.viewUrl,
                editUrl: data.editUrl === "" ? null : data.editUrl,
            });

            toast.success(
                mode === "create"
                    ? "Documento criado com sucesso!"
                    : "Documento atualizado com sucesso!", {
                    position: "top-center",
                    richColors: true,
                }
            );

            reset();
            setStep(1);
            onOpenChange(false);
        } catch (error) {
            toast.error(
                mode === "create"
                    ? "Erro ao criar documento."
                    : "Erro ao atualizar documento.", {
                    position: "top-center",
                    richColors: true,
                }
            );
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-5/6 h-fit p-0 overflow-hidden">
                <form className="flex flex-col w-full" onSubmit={handleSubmit(handleDocumentSubmit)}>
                    <DialogHeader className="border-b bg-muted/40 p-6">
                        <DialogTitle>
                            {mode === "create"
                                ? "Criar Documento"
                                : "Editar Documento"}
                        </DialogTitle>

                        <DialogDescription>
                            {mode === "create"
                                ? "Preencha os dados para cadastrar um novo documento."
                                : "Altere as informações do documento."}
                        </DialogDescription>
                    </DialogHeader>

                    <Stepper
                        value={step}
                        onValueChange={setStep}
                        indicators={{
                            completed: (
                                <CheckIcon className="size-3.5" />
                            ),
                            loading: (
                                <LoaderCircleIcon className="size-3.5 animate-spin" />
                            ),
                        }}
                        className="w-ful py-6 px-8 space-y-8"
                    >
                        <StepperNav>
                            {steps.map((step, index) => (
                                <StepperItem
                                    key={index}
                                    step={index + 1}
                                    className="relative flex-1 items-start"
                                >
                                    <StepperTrigger onClick={(e) => e.preventDefault()} className="flex flex-col gap-2.5">
                                        <StepperIndicator>{index + 1}</StepperIndicator>
                                        <StepperTitle>{step.title}</StepperTitle>
                                        <StepperDescription>{step.description}</StepperDescription>
                                    </StepperTrigger>
                                    {steps.length > index + 1 && (
                                        <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-2.5 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                        <StepperContent value={1}>
                            <StepConfiguration
                                control={control}
                                register={register}
                                errors={errors}
                                onOpenChange={onOpenChange}
                                onNextStep={handleNextStep}
                            />
                        </StepperContent>
                        <StepperContent value={2}>
                            <StepProfiles
                                control={control}
                                errors={errors}
                                onOpenChange={onOpenChange}
                                onNextStep={handleNextStep}
                                onPrevStep={handlePrevStep}
                            />
                        </StepperContent>
                        <StepperContent value={3}>
                            <StepFinish
                                mode={mode}
                                control={control}
                                onPrevStep={handlePrevStep}
                                isSubmitting={isSubmitting}
                                onOpenChange={onOpenChange}
                                onIsPending={isPending}
                                handleSubmit={handleSubmit}
                                onSubmit={handleDocumentSubmit}
                            />
                        </StepperContent>
                    </Stepper>
                </form>
            </DialogContent>
        </Dialog>
    );
}