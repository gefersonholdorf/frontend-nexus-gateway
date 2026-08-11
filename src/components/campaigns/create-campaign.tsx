import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";


interface MonthYearPickerProps {
    value?: string;
    onChange: (value: string) => void;
}

const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
];

const years = Array.from(
    { length: 11 },
    (_, index) => 2025 + index
);

export function MonthYearPicker({
    value,
    onChange,
}: MonthYearPickerProps) {

    const [year, month] = value?.split("-") ?? [];

    function handleMonthChange(month: string) {
        const selectedYear = year || String(new Date().getFullYear());

        onChange(`${selectedYear}-${month}`);
    }

    function handleYearChange(year: string) {
        const selectedMonth =
            month || String(new Date().getMonth() + 1).padStart(2, "0");

        onChange(`${year}-${selectedMonth}`);
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <Select
                value={month}
                onValueChange={handleMonthChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>

                <SelectContent>
                    {months.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={year}
                onValueChange={handleYearChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>

                <SelectContent>
                    {years.map((year) => (
                        <SelectItem
                            key={year}
                            value={String(year)}
                        >
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

interface CreateCampaignModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "update";
    defaultValues?: Partial<CreateCampaignSchema>;
    onSubmit: (data: CreateCampaignSchema) => Promise<void>;
    isPending: boolean;
}

const createCampaignSchema = z
    .object({
        code: z.string().min(1, "Informe o código."),
        title: z.string().min(1, "Informe o título."),
        description: z.string().min(1, "Informe a descrição."),
        monthYear: z
            .string()
            .regex(
                /^\d{4}-(0[1-9]|1[0-2])$/,
                "Selecione um mês válido."
            ),
        publishDate: z.string().min(
            1,
            "Informe a data de publicação."
        ),
        status: z.enum([
            "DRAFT",
            "SCHEDULED",
        ]),
        url: z.url("Informe uma URL válida."),
    })
    .superRefine((data, ctx) => {
        if (!data.monthYear || !data.publishDate) {
            return;
        }

        const [year, month] = data.monthYear.split("-").map(Number);
        const publicationDate = new Date(data.publishDate);

        if (Number.isNaN(publicationDate.getTime())) {
            return;
        }

        const sameMonth =
            publicationDate.getFullYear() === year &&
            publicationDate.getMonth() + 1 === month;

        if (!sameMonth) {
            ctx.addIssue({
                code: "custom",
                path: ["publishDate"],
                message:
                    "A data de publicação deve pertencer ao mês selecionado.",
            });
        }
    });

export type CreateCampaignSchema = z.infer<
    typeof createCampaignSchema
>;

export function CampaignFormModal({
    open,
    onOpenChange,
    onSubmit,
    defaultValues,
    isPending,
    mode = "create",
}: CreateCampaignModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateCampaignSchema>({
        resolver: zodResolver(createCampaignSchema),
        defaultValues: {
            code: "",
            description: "",
            monthYear: "",
            publishDate: "",
            status: "DRAFT",
            title: "",
            url: "",
            ...defaultValues,
        },
    });

    const monthYear = watch("monthYear");

    useEffect(() => {
        if (!monthYear) {
            return;
        }

        const currentPublishDate = watch("publishDate");

        if (!currentPublishDate) {
            return;
        }

        const [year, month] = monthYear.split("-").map(Number);
        const publicationDate = new Date(currentPublishDate);

        if (
            publicationDate.getFullYear() !== year ||
            publicationDate.getMonth() + 1 !== month
        ) {
            setValue("publishDate", "", {
                shouldValidate: true,
            });
        }
    }, [monthYear, setValue, watch]);

    useEffect(() => {
        if (open) {
            reset({
                code: "",
                description: "",
                monthYear: "",
                publishDate: "",
                status: "DRAFT",
                title: "",
                url: "",
                ...defaultValues,
            });
        }
    }, [open, defaultValues, reset]);

    async function handleCampaignSubmit(
        data: CreateCampaignSchema
    ) {
        try {
            await onSubmit(data);

            toast.success(
                mode === "create"
                    ? "Campanha criada com sucesso!"
                    : "Campanha atualizada com sucesso!",
                {
                    position: "top-center",
                    richColors: true,
                }
            );

            reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(
                mode === "create"
                    ? "Erro ao criar campanha."
                    : "Erro ao atualizar campanha.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-5/6 max-w-3xl p-0 overflow-hidden">
                <form
                    className="flex flex-col w-full"
                    onSubmit={handleSubmit(handleCampaignSubmit)}
                >
                    <DialogHeader className="border-b bg-muted/40 p-6">
                        <DialogTitle>
                            {mode === "create"
                                ? "Criar Campanha"
                                : "Editar Campanha"}
                        </DialogTitle>

                        <DialogDescription>
                            {mode === "create"
                                ? "Preencha os dados para cadastrar uma nova campanha."
                                : "Altere as informações da campanha."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-5 p-6">
                        {/* Código */}
                        <div className="space-y-2">
                            <Label htmlFor="code">
                                Código
                            </Label>

                            <Input
                                id="code"
                                placeholder="Ex.: CAMP-2026-08"
                                {...register("code")}
                            />

                            {errors.code && (
                                <p className="text-sm text-destructive">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>

                        {/* Título */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Título
                            </Label>

                            <Input
                                id="title"
                                placeholder="Título da campanha"
                                {...register("title")}
                            />

                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Mês/Ano */}
                        <div className="space-y-2">
                            <Label htmlFor="monthYear">
                                Mês da campanha
                            </Label>

                            <Controller
    control={control}
    name="monthYear"
    render={({ field }) => (
        <MonthYearPicker
            value={field.value}
            onChange={field.onChange}
        />
    )}
/>

                            <p className="text-xs text-muted-foreground">
                                Define o mês ao qual a campanha pertence.
                            </p>

                            {errors.monthYear && (
                                <p className="text-sm text-destructive">
                                    {errors.monthYear.message}
                                </p>
                            )}
                        </div>

                        {/* Data publicação */}
                        <div className="space-y-2">
                            <Label htmlFor="publishDate">
                                Data de publicação
                            </Label>

                            <Controller
                                control={control}
                                name="publishDate"
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                                disabled={!monthYear}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />

                                                {field.value
                                                    ? format(
                                                        new Date(field.value),
                                                        "dd 'de' MMMM 'de' yyyy",
                                                        { locale: ptBR }
                                                    )
                                                    : "Selecione uma data"}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : undefined
                                                }
                                                onSelect={(date) => {
                                                    if (!date) {
                                                        field.onChange("");
                                                        return;
                                                    }

                                                    const currentTime = field.value
                                                        ? new Date(field.value)
                                                        : new Date();

                                                    date.setHours(
                                                        currentTime.getHours(),
                                                        currentTime.getMinutes(),
                                                        0,
                                                        0
                                                    );

                                                    field.onChange(
                                                        format(date, "yyyy-MM-dd'T'HH:mm")
                                                    );
                                                }}
                                                disabled={(date) => {
                                                    if (!monthYear) {
                                                        return true;
                                                    }

                                                    const [year, month] = monthYear
                                                        .split("-")
                                                        .map(Number);

                                                    return (
                                                        date.getFullYear() !== year ||
                                                        date.getMonth() + 1 !== month
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />

                            <p className="text-xs text-muted-foreground">
                                A publicação deve ocorrer dentro do mês
                                selecionado.
                            </p>

                            {errors.publishDate && (
                                <p className="text-sm text-destructive">
                                    {errors.publishDate.message}
                                </p>
                            )}
                        </div>

                        {/* Status */}
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
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="DRAFT">
                                                Rascunho
                                            </SelectItem>

                                            <SelectItem value="SCHEDULED">
                                                Agendada
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <Label htmlFor="url">
                                URL da publicação
                            </Label>

                            <Input
                                id="url"
                                type="url"
                                placeholder="https://..."
                                {...register("url")}
                            />

                            {errors.url && (
                                <p className="text-sm text-destructive">
                                    {errors.url.message}
                                </p>
                            )}
                        </div>

                        {/* Descrição */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">
                                Descrição
                            </Label>

                            <Textarea
                                id="description"
                                placeholder="Descreva a campanha..."
                                className="min-h-28 resize-none"
                                {...register("description")}
                            />

                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t bg-muted/20 p-4">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Salvando..."
                                : mode === "create"
                                    ? "Criar campanha"
                                    : "Salvar alterações"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}