
import { useCreateVersion } from "@/api/documents/versions/create-version";
import { useFetchUserLists } from "@/api/users/use-users-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ExternalLinkIcon,
    InfoIcon,
    LoaderCircleIcon,
    PlusIcon
} from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createVersionSchema = z.object({
    changeLog: z
        .string()
        .trim()
        .min(1, "Informe as alterações realizadas.")
        .max(
            500,
            "As alterações devem possuir no máximo 500 caracteres."
        ),

    onwerId: z
        .number({
            error: "Informe um usuário válido.",
        })
        .int("Informe um usuário válido.")
        .positive("Selecione o responsável pelo reviewo."),
    editUrl: z.url("Informe uma URL válida."),
});

export type CreateVersionSchema = z.infer<
    typeof createVersionSchema
>;

export interface RevisionreviewSummary {
    id: number;
    currentVersion: string;
    editUrl?: string | null;
}

interface CreateVersionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: RevisionreviewSummary | null;
    currentUserId?: number;
    nextVersion: string;
    isPending?: boolean;
}

export function CreateVersionModal({
    open,
    onOpenChange,
    review,
    currentUserId,
    nextVersion,
    isPending = false,
}: CreateVersionModalProps) {
    const { mutateAsync } = useCreateVersion();
    const { data: users, isLoading: isLoadingUsers } =
        useFetchUserLists();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CreateVersionSchema>({
        resolver: zodResolver(createVersionSchema),
        defaultValues: {
            changeLog: "",
            editUrl: review?.editUrl ?? "",
        },
    });

    const changeLog = watch("changeLog");
    const editUrl = watch("editUrl");

    const isLoading = isPending || isSubmitting;

    useEffect(() => {
        if (!open) {
            return;
        }

        reset({
            changeLog: "",
            onwerId: currentUserId,
            editUrl: review?.editUrl ?? "",
        });
    }, [
        open,
        review?.id,
        review?.editUrl,
        currentUserId,
        reset,
    ]);

    function handleModalOpenChange(value: boolean) {
        if (isLoading) {
            return;
        }

        onOpenChange(value);
    }

    async function handleCreateVersion(
        data: CreateVersionSchema
    ) {
        if (!review) {
            toast.error("reviewo não encontrado.", {
                position: "top-center",
                richColors: true,
            });

            return;
        }

        try {
            await mutateAsync({
                documentId: review.id,
                changeLog: data.changeLog,
                onwerId: data.onwerId,
                editUrl: data.editUrl,
            });

            toast.success("Versão criada com sucesso!", {
                position: "top-center",
                richColors: true,
            });

            reset({
                changeLog: "",
                onwerId: currentUserId,
                editUrl: review.editUrl ?? "",
            });

            onOpenChange(false);
        } catch (error) {
            console.error("Erro ao criar versão:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao criar versão.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );
        }
    }

    if (!review) {
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
                                Criar nova versão
                            </DialogTitle>

                            <DialogDescription>
                                Crie uma nova versão a partir da versão
                                vigente do reviewo.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    className="flex min-h-0 flex-1 flex-col"
                    onSubmit={handleSubmit(handleCreateVersion)}
                >
                    <div
                        className="
                            min-h-0
                            flex-1
                            space-y-5
                            overflow-y-auto
                            p-6
                        "
                    >
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
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            <InfoIcon className="mt-0.5 size-4 shrink-0" />

                            <p>
                                Será criada a versão{" "}
                                <strong>{nextVersion}</strong>{" "}
                                a partir da versão{" "}
                                <strong>
                                    {review.currentVersion}
                                </strong>
                                .
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ownerId">
                                Responsável pela versão
                            </Label>

                            <Controller
                                control={control}
                                name="onwerId"
                                render={({ field }) => (
                                    <Select
                                        value={
                                            field.value
                                                ? String(
                                                    field.value
                                                )
                                                : ""
                                        }
                                        onValueChange={
                                            field.onChange
                                        }
                                        disabled={
                                            isLoading ||
                                            isLoadingUsers
                                        }
                                    >
                                        <SelectTrigger
                                            id="ownerId"
                                            className="w-full"
                                            aria-invalid={
                                                !!errors.onwerId
                                            }
                                        >
                                            <SelectValue
                                                placeholder={
                                                    isLoadingUsers
                                                        ? "Carregando usuários..."
                                                        : "Selecione o responsável"
                                                }
                                            />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {users?.users?.map(
                                                (user) => (
                                                    <SelectItem
                                                        key={
                                                            user.id
                                                        }
                                                        value={String(
                                                            user.id
                                                        )}
                                                        className="p-2"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="size-6">
                                                                <AvatarImage src={user.avatarUrl ?? ""} />
                                                                <AvatarFallback className="text-[10px]">
                                                                    {getInitials(
                                                                        user.name
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <span className="truncate">
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

                            {errors.onwerId && (
                                <p className="text-sm text-red-500">
                                    {errors.onwerId.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editUrl">
                                URL de edição *
                            </Label>

                            <Controller
                                control={control}
                                name="editUrl"
                                render={({ field }) => (
                                    <div className="flex gap-2">
                                        <Input
                                            {...field}
                                            id="editUrl"
                                            type="url"
                                            disabled={isLoading}
                                            aria-invalid={
                                                !!errors.editUrl
                                            }
                                            placeholder="https://..."
                                            className="min-w-0 flex-1"
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={!editUrl}
                                            title="Abrir URL de edição"
                                            onClick={() => {
                                                if (!editUrl) {
                                                    return;
                                                }

                                                window.open(
                                                    editUrl,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                );
                                            }}
                                        >
                                            <ExternalLinkIcon className="size-4" />

                                            <span className="sr-only">
                                                Abrir URL de edição
                                            </span>
                                        </Button>
                                    </div>
                                )}
                            />

                            <p className="text-xs text-muted-foreground">
                                O endereço atual do reviewo foi
                                preenchido automaticamente, mas pode ser
                                alterado.
                            </p>

                            {errors.editUrl && (
                                <p className="text-sm text-red-500">
                                    {errors.editUrl.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="changeLog">
                                    Alterações realizadas *
                                </Label>

                                <span className="text-xs text-muted-foreground">
                                    {changeLog?.length ?? 0}/500
                                </span>
                            </div>

                            <Controller
                                control={control}
                                name="changeLog"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id="changeLog"
                                        rows={5}
                                        maxLength={500}
                                        disabled={isLoading}
                                        aria-invalid={
                                            !!errors.changeLog
                                        }
                                        placeholder="Descreva as alterações realizadas nesta nova versão..."
                                        className="resize-none"
                                    />
                                )}
                            />

                            {errors.changeLog && (
                                <p className="text-sm text-red-500">
                                    {errors.changeLog.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter
                        className="
                            flex-row
                            justify-end
                            gap-3
                            border-t
                            bg-muted/20
                            p-6
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() =>
                                handleModalOpenChange(false)
                            }
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isLoading || isLoadingUsers
                            }
                        >
                            {isLoading ? (
                                <LoaderCircleIcon className="size-4 animate-spin" />
                            ) : (
                                <PlusIcon className="size-4" />
                            )}

                            {isLoading
                                ? "Criando..."
                                : "Criar versão"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
}