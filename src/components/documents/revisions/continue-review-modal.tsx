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
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeftIcon,
    CheckIcon,
    Clock3Icon,
    FilePenLineIcon,
    FileTextIcon,
    InfoIcon,
    LoaderCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type {
    OpenDocumentRevision,
    RevisionDocumentSummary,
} from "./revision-modal.types";

interface ContinueReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: RevisionDocumentSummary | null;
    revision: OpenDocumentRevision | null;
    isPending?: boolean;
    onContinue: (
        documentId: number,
        revisionId: number
    ) => Promise<void>;
}

const steps = [
    {
        title: "Revisão em Andamento",
        description: "Consulte os dados da revisão aberta",
    },
    {
        title: "Confirmação",
        description: "Confirme o acesso à edição",
    },
];

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
}

export function ContinueReviewModal({
    open,
    onOpenChange,
    document,
    revision,
    isPending = false,
    onContinue,
}: ContinueReviewModalProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLoading = isPending || isSubmitting;

    useEffect(() => {
        if (open) {
            setStep(1);
        }
    }, [open]);

    async function handleContinue() {
        if (!document || !revision) {
            toast.error("Não foi possível localizar a revisão.", {
                position: "top-center",
                richColors: true,
            });

            return;
        }

        try {
            setIsSubmitting(true);

            await onContinue(document.id, revision.id);

            onOpenChange(false);
        } catch (error) {
            console.error("Erro ao continuar revisão:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao continuar revisão.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!document || !revision) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    flex max-h-[92vh] w-[calc(100%-2rem)]
                    max-w-3xl flex-col gap-0 overflow-hidden p-0
                "
            >
                <DialogHeader className="border-b bg-muted/30 p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className="
                                flex size-12 shrink-0 items-center
                                justify-center rounded-full border
                                border-amber-500/30 bg-amber-500/10
                                text-amber-500
                            "
                        >
                            <FilePenLineIcon className="size-6" />
                        </div>

                        <div className="space-y-1">
                            <DialogTitle className="text-xl">
                                Continuar Revisão
                            </DialogTitle>

                            <DialogDescription>
                                Retome a revisão em andamento deste
                                documento.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Stepper
                    value={step}
                    indicators={{
                        completed: <CheckIcon className="size-3.5" />,
                        loading: (
                            <LoaderCircleIcon className="size-3.5 animate-spin" />
                        ),
                    }}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="border-b px-6 py-5">
                        <StepperNav>
                            {steps.map((item, index) => (
                                <StepperItem
                                    key={item.title}
                                    step={index + 1}
                                    className="relative flex-1 items-start"
                                >
                                    <StepperTrigger
                                        type="button"
                                        onClick={(event) =>
                                            event.preventDefault()
                                        }
                                        className="flex flex-col gap-2.5"
                                    >
                                        <StepperIndicator>
                                            {index + 1}
                                        </StepperIndicator>

                                        <StepperTitle>
                                            {item.title}
                                        </StepperTitle>

                                        <StepperDescription className="hidden sm:block">
                                            {item.description}
                                        </StepperDescription>
                                    </StepperTrigger>

                                    {steps.length > index + 1 && (
                                        <StepperSeparator
                                            className="
                                                absolute inset-x-0 top-2.5
                                                left-[calc(50%+0.875rem)]
                                                m-0 w-[calc(100%-2rem+0.225rem)]
                                                flex-none
                                                group-data-[state=completed]/step:bg-primary
                                            "
                                        />
                                    )}
                                </StepperItem>
                            ))}
                        </StepperNav>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <StepperContent
                            value={1}
                            className="m-0 space-y-5 p-6"
                        >
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Resumo do documento
                                </p>

                                <div className="flex items-center gap-4 rounded-lg border bg-muted/20 p-4">
                                    <div
                                        className="
                                            flex size-14 shrink-0
                                            items-center justify-center
                                            rounded-lg border
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
                                                border-amber-500/30
                                                bg-amber-500/10
                                                text-amber-500
                                            "
                                        >
                                            Em Revisão
                                        </Badge>

                                        <span className="text-sm text-muted-foreground">
                                            Versão {revision.version} (
                                            {revision.revisionCode})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="
                                    flex items-start gap-3 rounded-md
                                    border border-amber-500/40
                                    bg-amber-500/5 p-4 text-sm
                                "
                            >
                                <Clock3Icon className="mt-0.5 size-4 shrink-0 text-amber-500" />

                                <p>
                                    Existe uma revisão em andamento para
                                    este documento desde{" "}
                                    <strong>
                                        {formatDateTime(
                                            revision.createdAt
                                        )}
                                    </strong>
                                    . Ao continuar, você será direcionado
                                    para a edição desta revisão.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-lg border">
                                <div className="border-b bg-muted/20 p-4">
                                    <h3 className="font-medium">
                                        Detalhes da revisão em andamento
                                    </h3>
                                </div>

                                <div className="divide-y">
                                    <DetailRow
                                        label="Versão"
                                        value={revision.version}
                                    />

                                    <DetailRow
                                        label="Revisão"
                                        value={revision.revisionCode}
                                    />

                                    <div className="grid grid-cols-[minmax(120px,1fr)_2fr] items-center gap-4 px-4 py-3 text-sm">
                                        <span className="text-muted-foreground">
                                            Status
                                        </span>

                                        <div>
                                            <Badge
                                                variant="outline"
                                                className="
                                                    border-amber-500/30
                                                    bg-amber-500/10
                                                    text-amber-500
                                                "
                                            >
                                                {revision.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[minmax(120px,1fr)_2fr] items-center gap-4 px-4 py-3 text-sm">
                                        <span className="text-muted-foreground">
                                            Responsável
                                        </span>

                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-9">
                                                <AvatarImage
                                                    src={
                                                        revision
                                                            .responsible
                                                            .avatarUrl ??
                                                        ""
                                                    }
                                                    alt=""
                                                />

                                                <AvatarFallback className="text-xs">
                                                    {getInitials(
                                                        revision
                                                            .responsible
                                                            .name
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {
                                                        revision
                                                            .responsible
                                                            .name
                                                    }
                                                </p>

                                                {revision.responsible
                                                    .role && (
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {
                                                                revision
                                                                    .responsible
                                                                    .role
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <DetailRow
                                        label="Data de criação"
                                        value={formatDateTime(
                                            revision.createdAt
                                        )}
                                    />

                                    <DetailRow
                                        label="Última atualização"
                                        value={formatDateTime(
                                            revision.updatedAt
                                        )}
                                    />

                                    <DetailRow
                                        label="Conclusão prevista"
                                        value={
                                            revision.expectedCompletionDate
                                                ? formatDateTime(
                                                    revision.expectedCompletionDate
                                                )
                                                : "Não informada"
                                        }
                                    />
                                </div>
                            </div>

                            {revision.description && (
                                <div className="rounded-lg border bg-muted/20 p-4">
                                    <p className="text-sm font-medium">
                                        Descrição da revisão
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                                        {revision.description}
                                    </p>
                                </div>
                            )}

                            <div
                                className="
                                    flex items-start gap-3 rounded-md
                                    border border-blue-500/40
                                    bg-blue-500/5 p-4 text-sm
                                    text-blue-500
                                "
                            >
                                <InfoIcon className="mt-0.5 size-4 shrink-0" />

                                <p>
                                    Ao continuar, você poderá editar o
                                    conteúdo e enviar a revisão para
                                    aprovação quando estiver pronta.
                                </p>
                            </div>
                        </StepperContent>

                        <StepperContent
                            value={2}
                            className="m-0 space-y-5 p-6"
                        >
                            <div className="rounded-lg border bg-muted/20 p-6 text-center">
                                <div
                                    className="
                                        mx-auto flex size-14 items-center
                                        justify-center rounded-full
                                        border border-blue-500/30
                                        bg-blue-500/10 text-blue-500
                                    "
                                >
                                    <FilePenLineIcon className="size-7" />
                                </div>

                                <h3 className="mt-4 text-lg font-semibold">
                                    Continuar edição da revisão?
                                </h3>

                                <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                                    Você será direcionado para a versão{" "}
                                    <strong>{revision.version}</strong>,
                                    revisão{" "}
                                    <strong>
                                        {revision.revisionCode}
                                    </strong>
                                    , atualmente em status{" "}
                                    <strong>{revision.status}</strong>.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-lg border">
                                <DetailRow
                                    label="Documento"
                                    value={document.title}
                                />

                                <DetailRow
                                    label="Código"
                                    value={document.code}
                                />

                                <DetailRow
                                    label="Versão"
                                    value={revision.version}
                                />

                                <DetailRow
                                    label="Revisão"
                                    value={revision.revisionCode}
                                />

                                <DetailRow
                                    label="Responsável"
                                    value={revision.responsible.name}
                                />
                            </div>

                            <div
                                className="
                                    flex items-start gap-3 rounded-md
                                    border border-amber-500/40
                                    bg-amber-500/5 p-4 text-sm
                                "
                            >
                                <InfoIcon className="mt-0.5 size-4 shrink-0 text-amber-500" />

                                <p>
                                    Continuar uma revisão não cria uma
                                    nova versão e não altera o histórico.
                                    A mesma revisão pendente será
                                    retomada.
                                </p>
                            </div>
                        </StepperContent>
                    </div>
                </Stepper>

                <Separator />

                <DialogFooter className="flex-row justify-end gap-3 p-6">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => {
                            if (step === 1) {
                                onOpenChange(false);
                                return;
                            }

                            setStep(1);
                        }}
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
                            onClick={() => setStep(2)}
                        >
                            Continuar
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            disabled={isLoading}
                            onClick={handleContinue}
                        >
                            {isLoading ? (
                                <LoaderCircleIcon className="size-4 animate-spin" />
                            ) : (
                                <FilePenLineIcon className="size-4" />
                            )}

                            {isLoading
                                ? "Abrindo..."
                                : "Continuar Revisão"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface DetailRowProps {
    label: string;
    value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="grid grid-cols-[minmax(120px,1fr)_2fr] items-center gap-4 border-b px-4 py-3 text-sm last:border-b-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}