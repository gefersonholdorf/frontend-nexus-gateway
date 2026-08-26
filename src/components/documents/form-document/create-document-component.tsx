import { useCreateDocument } from "@/api/documents/create-document";
import { useGetProfilesSelect } from "@/api/profiles/get-select-profiles";
import { useFetchUserLists } from "@/api/users/use-users-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck, FileText, X } from "lucide-react";
import {
    Controller,
    useForm
} from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const createDocumentSchema = z.object({
    code: z.string().min(1, "Código obrigatório"),
    title: z.string().min(1, "Título obrigatório"),
    category: z.string().min(1, "Categoria obrigatória"),
    classification: z.string().min(1, "Classificação obrigatório"),
    process: z.string().min(1, "Área/Processo obrigatório"),
    editUrl: z.url("Deve ser adicionado uma url válida"),
    ownerId: z.string().min(1, "Deve ser selecionado o responsável"),
    profiles: z.array(z.number()).min(1, "Selecione pelo menos um perfil"),
});

export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>;

export function CreateDocumentComponent() {
    const { data: profiles } = useGetProfilesSelect();
    const { data: users } = useFetchUserLists()
    const { mutateAsync } = useCreateDocument()

    const navigate = useNavigate()

    const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<CreateDocumentSchema>({
        resolver: zodResolver(createDocumentSchema),
        defaultValues: {
            code: "",
            category: "",
            classification: "",
            process: "",
            title: "",
            ownerId: "",
            editUrl: "",
            profiles: [],
        },
    });

    const onSubmit = async (data: CreateDocumentSchema) => {
        try {
            await mutateAsync({
                ...data
            })

            toast.success("Documento criado com sucesso!", {
                position: "top-center",
                richColors: true,
            }
            );

            reset();

            navigate("/documents")

        } catch (error) {
            console.error("Erro ao criar documento:", error);
            toast.error("Erro ao criar documento.", {
                position: "top-center",
                richColors: true,
            }
            );
        }
    };

    return (
        <div className="grid grid-cols-6 gap-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="col-span-4 shadow-sm flex flex-col space-y-6 w-full bg-(image:--background-gradient) rounded-lg border border-border p-6"
            >
                <div>
                    <h3 className="text-lg font-semibold text-primary-text">
                        Informações Gerais
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Título do Documento</Label>

                        <Input
                            placeholder="Ex: POLÍTICA DE SEGURANÇA DA INFORMAÇÃO"
                            {...register("title")}
                        />

                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Código do Documento</Label>

                        <Input
                            placeholder="Ex: PROC-001"
                            {...register("code")}
                        />

                        {errors.code && (
                            <p className="text-sm text-red-500">
                                {errors.code.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Link do Documento em Edição</Label>

                        <Input
                            type="text"
                            placeholder="Informe a URL do documento..."
                            {...register("editUrl")}
                        />

                        {errors.editUrl && (
                            <p className="text-sm text-red-500">
                                {errors.editUrl.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Classificação da Informação</Label>

                        <Controller
                            control={control}
                            name="classification"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a Classificação" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Público">
                                                Público
                                            </SelectItem>
                                            <SelectItem value="Interno">
                                                Interno
                                            </SelectItem>
                                            <SelectItem value="Confidencial">
                                                Confidencial
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.classification && (
                            <p className="text-sm text-red-500">
                                {errors.classification.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Responsável pelo Documento</Label>

                        <Controller
                            control={control}
                            name="ownerId"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o responsável" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {users && users?.users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={String(user.id)}
                                                className="p-2"
                                            >
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={user.avatarUrl ?? ""} />
                                                    <AvatarFallback>
                                                        {user.name
                                                            .split(" ")
                                                            .slice(0, 2)
                                                            .map(n => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.ownerId && (
                            <p className="text-sm text-red-500">
                                {errors.ownerId.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Área / Processo</Label>

                        <Controller
                            control={control}
                            name="process"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a área ou processo" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Administrativo</SelectLabel>

                                            <SelectItem value="Diretoria">
                                                Diretoria
                                            </SelectItem>

                                            <SelectItem value="RH">
                                                Recursos Humanos
                                            </SelectItem>

                                            <SelectItem value="Financeiro">
                                                Financeiro
                                            </SelectItem>

                                            <SelectItem value="Comercial">
                                                Comercial
                                            </SelectItem>
                                        </SelectGroup>

                                        <SelectGroup>
                                            <SelectLabel>Tecnologia</SelectLabel>

                                            <SelectItem value="Infraestrutura">
                                                Infraestrutura
                                            </SelectItem>

                                            <SelectItem value="DevOps">
                                                DevOps
                                            </SelectItem>

                                            <SelectItem value="Desenvolvimento">
                                                Desenvolvimento
                                            </SelectItem>

                                            <SelectItem value="Suporte">
                                                Suporte
                                            </SelectItem>

                                            <SelectItem value="SegurancaInformacao">
                                                Segurança da Informação
                                            </SelectItem>
                                        </SelectGroup>

                                        <SelectGroup>
                                            <SelectLabel>Gestão</SelectLabel>

                                            <SelectItem value="SGSI">
                                                SGSI
                                            </SelectItem>

                                            <SelectItem value="GestaoRiscos">
                                                Gestão de Riscos
                                            </SelectItem>

                                            <SelectItem value="ContinuidadeNegocios">
                                                Continuidade de Negócios
                                            </SelectItem>

                                            <SelectItem value="Auditoria">
                                                Auditoria
                                            </SelectItem>

                                            <SelectItem value="LGPD">
                                                LGPD
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.process && (
                            <p className="text-sm text-red-500">
                                {errors.process.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Perfis com Acesso</Label>

                        <Controller
                            control={control}
                            name="profiles"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between bg-transparent hover:bg-transparent text-muted-foreground"
                                        >
                                            {field.value?.length
                                                ? `${field.value.length} perfil(is) selecionado(s)`
                                                : "Selecionar perfis"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full">
                                        <div className="space-y-2">
                                            {profiles?.profiles.map((profile) => {
                                                const checked = field.value?.includes(profile.id);

                                                return (
                                                    <div
                                                        key={profile.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Checkbox
                                                            checked={checked}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange([
                                                                        ...(field.value || []),
                                                                        profile.id,
                                                                    ]);
                                                                } else {
                                                                    field.onChange(
                                                                        (field.value || []).filter(
                                                                            (id) =>
                                                                                id !== profile.id
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                        />

                                                        <span>{profile.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        />

                        {watch("profiles")?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {profiles?.profiles
                                    .filter((p) => watch("profiles").includes(p.id))
                                    .map((profile) => (
                                        <Badge key={profile.id}>
                                            {profile.name}
                                        </Badge>
                                    ))}
                            </div>
                        )}

                        {errors.profiles && (
                            <p className="text-sm text-red-500">
                                {errors.profiles.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label>Informe a Categoria do Documento</Label>

                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a Categoria" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Procedimento">
                                                Procedimento
                                            </SelectItem>

                                            <SelectItem value="Manual">
                                                Manual
                                            </SelectItem>

                                            <SelectItem value="Política">
                                                Política
                                            </SelectItem>

                                            <SelectItem value="Formulário">
                                                Formulário
                                            </SelectItem>

                                            <SelectItem value="Termo">
                                                Termo
                                            </SelectItem>

                                            <SelectItem value="PCN">
                                                PCN
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.category && (
                            <p className="text-sm text-red-500">
                                {errors.category.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full justify-end flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        <X />
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <CheckCheck />
                        {isSubmitting ? "Salvando..." : "Salvar Documento"}
                    </Button>
                </div>
            </form>
            <div className="col-span-2 shadow-sm flex flex-col space-y-6 w-full bg-(image:--background-gradient) rounded-lg border border-border p-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full border border-blue-500">
                            <FileText className="size-5 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary-text">
                            Resumo do Documento
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Título
                                </p>

                                <p className="text-sm max-w-60 font-medium truncate">
                                    {watch("title") || "Novo Documento"}
                                </p>
                            </div>

                            <Badge
                                variant="outline"
                                className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                            >
                                Rascunho
                            </Badge>
                        </div>

                        <div className="border-t border-border pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Código
                                </span>

                                <span className="text-sm">
                                    {watch("code") || "-"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Categoria
                                </span>

                                <span className="text-sm">
                                    {watch("category") || "-"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Classificação
                                </span>

                                <span className="text-sm">
                                    {watch("classification") || "-"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Área / Processo
                                </span>

                                <span className="text-sm">
                                    {watch("process") || "-"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Responsável
                                </span>

                                <span className="text-sm">
                                    {users?.users.find(
                                        user => String(user.id) === watch("ownerId")
                                    )?.name || "-"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Versão
                                </span>

                                <span className="text-sm">
                                    0.1
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Link de Edição
                                </span>

                                <span className="text-sm truncate">
                                    {watch("editUrl") || "-"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 items-start">
                                <span className="text-sm text-muted-foreground">
                                    Perfis
                                </span>

                                <div className="flex flex-wrap gap-1">
                                    {profiles?.profiles
                                        .filter(profile =>
                                            watch("profiles")?.includes(profile.id)
                                        )
                                        .map(profile => (
                                            <Badge
                                                key={profile.id}
                                                variant="secondary"
                                                className="bg-primary text-white"
                                            >
                                                {profile.name}
                                            </Badge>
                                        ))}

                                    {!watch("profiles")?.length && (
                                        <span className="text-sm">-</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}