import {
    Stepper,
    StepperContent,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@/components/reui/stepper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckIcon,
    FileTextIcon,
    InfoIcon,
    LoaderCircleIcon,
    PlusIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    Controller,
    useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const steps = [
    {
        title: "Informações da Revisão",
        description: "Informe o motivo e o responsável",
    },
    {
        title: "Confirmação",
        description: "Revise os dados antes de criar",
    },
];

const reviewReasons = [
    {
        value: "PERIODIC_REVIEW",
        label: "Revisão periódica",
    },
    {
        value: "PROCESS_CHANGE",
        label: "Alteração de processo",
    },
    {
        value: "LEGAL_REQUIREMENT",
        label: "Alteração legal ou regulatória",
    },
    {
        value: "AUDIT_NONCONFORMITY",
        label: "Não conformidade de auditoria",
    },
    {
        value: "SECURITY_IMPROVEMENT",
        label: "Melhoria de segurança",
    },
    {
        value: "CONTENT_CORRECTION",
        label: "Correção de conteúdo",
    },
    {
        value: "OTHER",
        label: "Outro motivo",
    },
] as const;

const createReviewSchema = z.object({
    reason: z
        .string()
        .min(1, "Selecione o motivo da revisão"),

    description: z
        .string()
        .trim()
        .min(
            10,
            "Informe uma descrição com pelo menos 10 caracteres"
        )
        .max(
            500,
            "A descrição deve possuir no máximo 500 caracteres"
        ),

    responsibleId: z
        .number()
        .int("O responsável selecionado é inválido")
        .positive("Selecione o responsável pela revisão"),

    expectedCompletionDate: z
        .string()
        .nullable()
        .optional()
        .refine(
            (value) => {
                if (!value) {
                    return true;
                }

                const date = new Date(`${value}T12:00:00`);

                return !Number.isNaN(date.getTime());
            },
            {
                message: "Informe uma data válida",
            }
        ),

    observations: z
        .string()
        .trim()
        .max(
            300,
            "As observações devem possuir no máximo 300 caracteres"
        )
        .optional(),
});

export type CreateReviewSchema = z.infer<
    typeof createReviewSchema
>;

export interface RevisionDocumentSummary {
    id: number;
    code: string;
    title: string;
    category?: string | null;
    currentVersion: string;
    status: string;
    editUrl?: string | null;
}

export interface RevisionUser {
    id: number;
    name: string;
    avatarUrl?: string | null;
    role?: string | null;
}

interface CreateReviewModalProps {
    open: boolean;

    onOpenChange: (open: boolean) => void;

    document: RevisionDocumentSummary | null;

    users: RevisionUser[];

    currentUserId?: number;

    nextVersion: string;

    nextRevisionCode?: string;

    isPending?: boolean;

    onSubmit: (
        documentId: number,
        data: CreateReviewSchema
    ) => Promise<void>;
}

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function getReasonLabel(reason: string) {
    return (
        reviewReasons.find(
            (reviewReason) => reviewReason.value === reason
        )?.label ?? reason
    );
}

function formatDate(value: string | null | undefined) {
    if (!value) {
        return "Não informada";
    }

    const date = new Date(`${value}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "Data inválida";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
    }).format(date);
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function CreateReviewModal({
    open,
    onOpenChange,
    document,
    users,
    currentUserId,
    nextVersion,
    nextRevisionCode = "R01",
    isPending = false,
    onSubmit,
}: CreateReviewModalProps) {
    const [step, setStep] = useState(1);

    const {
        control,
        handleSubmit,
        reset,
        trigger,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CreateReviewSchema>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            reason: "",
            description: "",
            responsibleId: currentUserId ?? 0,
            expectedCompletionDate: null,
            observations: "",
        },
    });

    const reason = watch("reason");
    const description = watch("description");
    const responsibleId = watch("responsibleId");
    const expectedCompletionDate = watch(
        "expectedCompletionDate"
    );
    const observations = watch("observations");

    const selectedResponsible = useMemo(() => {
        return users.find(
            (user) => user.id === responsibleId
        );
    }, [responsibleId, users]);

    const isLoading = isPending || isSubmitting;

    useEffect(() => {
        if (!open) {
            return;
        }

        reset({
            reason: "",
            description: "",
            responsibleId: currentUserId ?? 0,
            expectedCompletionDate: null,
            observations: "",
        });

        setStep(1);
    }, [open, currentUserId, reset]);

    function handleModalOpenChange(value: boolean) {
        if (isLoading) {
            return;
        }

        onOpenChange(value);
    }

    async function handleNextStep() {
        const isValid = await trigger([
            "reason",
            "description",
            "responsibleId",
            "expectedCompletionDate",
            "observations",
        ]);

        if (!isValid) {
            return;
        }

        setStep(2);
    }

    function handlePreviousStep() {
        if (step === 1) {
            onOpenChange(false);
            return;
        }

        setStep(1);
    }

    async function handleCreateReview(
        data: CreateReviewSchema
    ) {
        if (!document) {
            toast.error("Documento não encontrado.", {
                position: "top-center",
                richColors: true,
            });

            return;
        }

        try {
            await onSubmit(document.id, {
                ...data,

                expectedCompletionDate:
                    data.expectedCompletionDate || null,

                observations:
                    data.observations?.trim() || undefined,
            });

            toast.success("Revisão criada com sucesso!", {
                position: "top-center",
                richColors: true,
            });

            reset({
                reason: "",
                description: "",
                responsibleId: currentUserId ?? 0,
                expectedCompletionDate: null,
                observations: "",
            });

            setStep(1);
            onOpenChange(false);
        } catch (error) {
            console.error("Erro ao criar revisão:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao criar revisão.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );
        }
    }

    if (!document) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleModalOpenChange}
        >
            <DialogContent
                className="
                    flex
                    max-h-[92vh]
                    w-[calc(100%-2rem)]
                    max-w-3xl
                    flex-col
                    gap-0
                    overflow-hidden
                    p-0
                "
            >
                <DialogHeader className="border-b bg-muted/30 p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className="
                                flex
                                size-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-violet-500/30
                                bg-violet-500/10
                                text-violet-500
                            "
                        >
                            <PlusIcon className="size-6" />
                        </div>

                        <div className="space-y-1">
                            <DialogTitle className="text-xl">
                                Criar Revisão
                            </DialogTitle>

                            <DialogDescription>
                                Uma nova versão e uma revisão serão
                                criadas para este documento.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    className="flex min-h-0 flex-1 flex-col"
                    onSubmit={handleSubmit(handleCreateReview)}
                >
                    <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-4">
                        <DocumentSummary
                            document={document}
                            version={
                                document.currentVersion
                            }
                        />

                        <div
                            className="
                                        flex
                                        items-start
                                        gap-3
                                        rounded-md
                                        border
                                        border-blue-500/40
                                        bg-blue-500/5
                                        p-4
                                        text-sm
                                        text-blue-500
                                    "
                        >
                            <InfoIcon className="mt-0.5 size-4 shrink-0" />

                            <p>
                                Será criada a versão{" "}
                                <strong>
                                    {nextVersion}
                                </strong>{" "}
                                e a revisão inicial{" "}
                                <strong>
                                    {nextRevisionCode}
                                </strong>{" "}
                                em status{" "}
                                <strong>Rascunho</strong>.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Motivo da revisão *
                            </Label>

                            <Controller
                                control={control}
                                name="reason"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={
                                            field.onChange
                                        }
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger
                                            id="reason"
                                            aria-invalid={
                                                !!errors.reason
                                            }
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Selecione o motivo" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {reviewReasons.map(
                                                (
                                                    reviewReason
                                                ) => (
                                                    <SelectItem
                                                        key={
                                                            reviewReason.value
                                                        }
                                                        value={
                                                            reviewReason.value
                                                        }
                                                    >
                                                        {
                                                            reviewReason.label
                                                        }
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.reason && (
                                <p className="text-sm text-red-500">
                                    {errors.reason.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="description">
                                    Descrição da revisão *
                                </Label>

                                <span className="text-xs text-muted-foreground">
                                    {description?.length ?? 0}
                                    /500
                                </span>
                            </div>

                            <Controller
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id="description"
                                        rows={4}
                                        maxLength={500}
                                        disabled={isLoading}
                                        aria-invalid={
                                            !!errors.description
                                        }
                                        placeholder="Explique brevemente o que motivou esta revisão..."
                                        className="resize-none"
                                    />
                                )}
                            />

                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.description
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="responsibleId">
                                    Responsável pela revisão *
                                </Label>

                                <Controller
                                    control={control}
                                    name="responsibleId"
                                    render={({ field }) => (
                                        <Select
                                            value={
                                                field.value > 0
                                                    ? String(
                                                        field.value
                                                    )
                                                    : ""
                                            }
                                            onValueChange={(
                                                value
                                            ) => {
                                                field.onChange(
                                                    Number(
                                                        value
                                                    )
                                                );
                                            }}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger
                                                id="responsibleId"
                                                aria-invalid={
                                                    !!errors.responsibleId
                                                }
                                                className="h-auto min-h-10 w-full"
                                            >
                                                <SelectValue placeholder="Selecione o responsável" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {users.map(
                                                    (user) => (
                                                        <SelectItem
                                                            key={
                                                                user.id
                                                            }
                                                            value={String(
                                                                user.id
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="size-6">
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatarUrl ??
                                                                            ""
                                                                        }
                                                                        alt=""
                                                                    />

                                                                    <AvatarFallback className="text-[10px]">
                                                                        {getInitials(
                                                                            user.name
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>

                                                                <span>
                                                                    {
                                                                        user.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.responsibleId && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .responsibleId
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expectedCompletionDate">
                                    Data prevista para conclusão
                                </Label>

                                <div className="relative">
                                    <CalendarIcon
                                        className="
                                                    pointer-events-none
                                                    absolute
                                                    top-1/2
                                                    left-3
                                                    size-4
                                                    -translate-y-1/2
                                                    text-muted-foreground
                                                "
                                    />

                                    <Controller
                                        control={control}
                                        name="expectedCompletionDate"
                                        render={({ field }) => (
                                            <Input
                                                id="expectedCompletionDate"
                                                type="date"
                                                min={getTodayDate()}
                                                disabled={
                                                    isLoading
                                                }
                                                value={
                                                    field.value ??
                                                    ""
                                                }
                                                onChange={(
                                                    event
                                                ) => {
                                                    field.onChange(
                                                        event
                                                            .target
                                                            .value ||
                                                        null
                                                    );
                                                }}
                                                aria-invalid={
                                                    !!errors.expectedCompletionDate
                                                }
                                                className="pl-9"
                                            />
                                        )}
                                    />
                                </div>

                                {errors.expectedCompletionDate && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .expectedCompletionDate
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="observations">
                                    Observações (opcional)
                                </Label>

                                <span className="text-xs text-muted-foreground">
                                    {observations?.length ??
                                        0}
                                    /300
                                </span>
                            </div>

                            <Controller
                                control={control}
                                name="observations"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id="observations"
                                        value={
                                            field.value ?? ""
                                        }
                                        rows={3}
                                        maxLength={300}
                                        disabled={isLoading}
                                        aria-invalid={
                                            !!errors.observations
                                        }
                                        placeholder="Informações adicionais sobre esta revisão..."
                                        className="resize-none"
                                    />
                                )}
                            />

                            {errors.observations && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.observations
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                        <Separator />

                        <DialogFooter className="flex-row justify-end gap-3 p-6">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={handlePreviousStep}
                            >
                                {step === 2 && (
                                    <ArrowLeftIcon className="size-4" />
                                )}

                                {step === 1 ? "Cancelar" : "Voltar"}
                            </Button>

                            {step === 1 ? (
                                <Button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={handleNextStep}
                                >
                                    Continuar
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LoaderCircleIcon className="size-4 animate-spin" />
                                    ) : (
                                        <PlusIcon className="size-4" />
                                    )}

                                    {isLoading
                                        ? "Criando..."
                                        : "Criar Revisão"}
                                </Button>
                            )}
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface DocumentSummaryProps {
    document: RevisionDocumentSummary;
    version: string;
}

function DocumentSummary({
    document,
    version,
}: DocumentSummaryProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">
                Resumo do documento atual
            </p>

            <div className="flex items-center gap-4 rounded-lg border bg-muted/20 p-4">
                <div
                    className="
                        flex
                        size-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-blue-500/20
                        bg-blue-500/10
                        text-blue-500
                    "
                >
                    <FileTextIcon className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                        {document.title}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {document.code}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge
                        variant="outline"
                        className="
                            border-emerald-500/30
                            bg-emerald-500/10
                            text-emerald-500
                        "
                    >
                        Vigente
                    </Badge>

                    <span className="text-sm text-muted-foreground">
                        Versão {version}
                    </span>
                </div>
            </div>
        </div>
    );
}

interface ConfirmationRowProps {
    label: string;
    value: string;
}

function ConfirmationRow({
    label,
    value,
}: ConfirmationRowProps) {
    return (
        <div
            className="
                grid
                grid-cols-[minmax(120px,1fr)_2fr]
                gap-4
                px-4
                py-3
                text-sm
            "
        >
            <span className="text-muted-foreground">
                {label}
            </span>

            <span className="break-words font-medium">
                {value}
            </span>
        </div>
    );
}