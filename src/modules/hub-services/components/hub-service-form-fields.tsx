import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
    Controller,
    useFieldArray,
    useWatch,
    type Control,
    type FieldErrors,
    type UseFormRegister,
    type UseFormSetValue,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
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

import {
    STATUS_CHECK_AUTH_TYPES,
    STATUS_CHECK_METHODS,
    type HubServiceFormInput,
    type HubServiceFormValues,
} from "./hub-service-form-schema";

interface HubServiceFormFieldsProps {
    register: UseFormRegister<HubServiceFormInput>;
    errors: FieldErrors<HubServiceFormInput>;
    control: Control<HubServiceFormInput, unknown, HubServiceFormValues>;
    setValue: UseFormSetValue<HubServiceFormInput>;
}

const METHOD_LABELS: Record<(typeof STATUS_CHECK_METHODS)[number], string> = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    HEAD: "HEAD",
    DELETE: "DELETE",
};

const AUTH_TYPE_LABELS: Record<(typeof STATUS_CHECK_AUTH_TYPES)[number], string> = {
    NONE: "Nenhuma",
    BEARER: "Bearer token",
    API_KEY_HEADER: "API Key em header",
    BASIC: "Basic auth",
};

// RF007/RF008: body só se aplica a métodos que aceitam corpo de requisição.
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

export function HubServiceFormFields({
    register,
    errors,
    control,
    setValue,
}: HubServiceFormFieldsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ds_status_check_headers",
    });

    const method = useWatch({ control, name: "st_status_check_method" });
    const authType = useWatch({ control, name: "st_status_check_auth_type" });
    const body = useWatch({ control, name: "ds_status_check_body" });
    const bodyAllowed = METHODS_WITH_BODY.has(method ?? "GET");

    // RF008: reage em tempo real à troca de método — limpa o corpo assim que
    // ele deixa de ser aplicável, para não deixar um valor obsoleto pronto
    // para ser bloqueado só no submit pelo `superRefine` do schema.
    useEffect(() => {
        if (!bodyAllowed && body) {
            setValue("ds_status_check_body", "", { shouldValidate: false, shouldDirty: false });
        }
    }, [bodyAllowed, body, setValue]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="st_type">Tipo</Label>
                    <Controller
                        control={control}
                        name="st_type"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="st_type" className="w-full">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SYSTEM">Sistema</SelectItem>
                                    <SelectItem value="SERVICE">Serviço</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.st_type && (
                        <span className="text-sm text-destructive">{errors.st_type.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="st_environment">Ambiente</Label>
                    <Controller
                        control={control}
                        name="st_environment"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="st_environment" className="w-full">
                                    <SelectValue placeholder="Selecione o ambiente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PROD">Produção</SelectItem>
                                    <SelectItem value="HOM">Homologação</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.st_environment && (
                        <span className="text-sm text-destructive">
                            {errors.st_environment.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_title">Título</Label>
                <Input id="ds_title" placeholder="Ex.: ERP Financeiro" {...register("ds_title")} />
                {errors.ds_title && (
                    <span className="text-sm text-destructive">{errors.ds_title.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_description">Descrição</Label>
                <Textarea
                    id="ds_description"
                    placeholder="Descreva o sistema ou serviço"
                    {...register("ds_description")}
                />
                {errors.ds_description && (
                    <span className="text-sm text-destructive">{errors.ds_description.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_access_url">URL de acesso</Label>
                <Input
                    id="ds_access_url"
                    placeholder="https://sistema.exemplo.com"
                    {...register("ds_access_url")}
                />
                {errors.ds_access_url && (
                    <span className="text-sm text-destructive">{errors.ds_access_url.message}</span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="ds_ip">IP</Label>
                    <Input id="ds_ip" placeholder="10.0.0.1" {...register("ds_ip")} />
                    {errors.ds_ip && (
                        <span className="text-sm text-destructive">{errors.ds_ip.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ds_port">Porta</Label>
                    <Input id="ds_port" inputMode="numeric" placeholder="8080" {...register("ds_port")} />
                    {errors.ds_port && (
                        <span className="text-sm text-destructive">{errors.ds_port.message}</span>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_status_url">URL de verificação de status</Label>
                <Input
                    id="ds_status_url"
                    placeholder="https://sistema.exemplo.com/health"
                    {...register("ds_status_url")}
                />
                {errors.ds_status_url && (
                    <span className="text-sm text-destructive">{errors.ds_status_url.message}</span>
                )}
            </div>

            {/* Teste de status (RF005-RF008): método, headers, autenticação e body. */}
            <div className="space-y-4 rounded-md border border-border/60 p-4">
                <h4 className="text-sm font-semibold text-foreground">Teste de status</h4>

                <div className="space-y-2">
                    <Label htmlFor="st_status_check_method">Método HTTP</Label>
                    <Controller
                        control={control}
                        name="st_status_check_method"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="st_status_check_method" className="w-full">
                                    <SelectValue placeholder="Selecione o método" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_CHECK_METHODS.map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {METHOD_LABELS[value]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.st_status_check_method && (
                        <span className="text-sm text-destructive">
                            {errors.st_status_check_method.message}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Headers</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ key: "", value: "" })}
                        >
                            <Plus className="size-3.5" />
                            Adicionar header
                        </Button>
                    </div>

                    {fields.length === 0 && (
                        <p className="text-xs text-muted-foreground">Nenhum header customizado.</p>
                    )}

                    {fields.map((fieldItem, index) => (
                        <div key={fieldItem.id} className="flex items-start gap-2">
                            <div className="flex-1 space-y-1">
                                <Input
                                    placeholder="Chave (ex.: X-Api-Key)"
                                    {...register(`ds_status_check_headers.${index}.key` as const)}
                                />
                                {errors.ds_status_check_headers?.[index]?.key && (
                                    <span className="text-sm text-destructive">
                                        {errors.ds_status_check_headers[index]?.key?.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    placeholder="Valor"
                                    {...register(`ds_status_check_headers.${index}.value` as const)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-destructive hover:text-destructive"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="st_status_check_auth_type">Autenticação</Label>
                    <Controller
                        control={control}
                        name="st_status_check_auth_type"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="st_status_check_auth_type" className="w-full">
                                    <SelectValue placeholder="Selecione a autenticação" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_CHECK_AUTH_TYPES.map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {AUTH_TYPE_LABELS[value]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.st_status_check_auth_type && (
                        <span className="text-sm text-destructive">
                            {errors.st_status_check_auth_type.message}
                        </span>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Por segurança, a credencial atual não é exibida ao editar. Preencha novamente
                        para mantê-la ou alterá-la.
                    </p>
                </div>

                {authType === "BEARER" && (
                    <div className="space-y-2">
                        <Label htmlFor="status_check_auth_token">Token</Label>
                        <Input
                            id="status_check_auth_token"
                            type="password"
                            placeholder="Token de autenticação"
                            {...register("status_check_auth_token")}
                        />
                        {errors.status_check_auth_token && (
                            <span className="text-sm text-destructive">
                                {errors.status_check_auth_token.message}
                            </span>
                        )}
                    </div>
                )}

                {authType === "API_KEY_HEADER" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="status_check_auth_header_name">Nome do header</Label>
                            <Input
                                id="status_check_auth_header_name"
                                placeholder="Ex.: X-Api-Key"
                                {...register("status_check_auth_header_name")}
                            />
                            {errors.status_check_auth_header_name && (
                                <span className="text-sm text-destructive">
                                    {errors.status_check_auth_header_name.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status_check_auth_header_value">Valor</Label>
                            <Input
                                id="status_check_auth_header_value"
                                type="password"
                                placeholder="Valor da chave"
                                {...register("status_check_auth_header_value")}
                            />
                            {errors.status_check_auth_header_value && (
                                <span className="text-sm text-destructive">
                                    {errors.status_check_auth_header_value.message}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {authType === "BASIC" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="status_check_auth_username">Usuário</Label>
                            <Input
                                id="status_check_auth_username"
                                placeholder="Usuário"
                                {...register("status_check_auth_username")}
                            />
                            {errors.status_check_auth_username && (
                                <span className="text-sm text-destructive">
                                    {errors.status_check_auth_username.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status_check_auth_password">Senha</Label>
                            <Input
                                id="status_check_auth_password"
                                type="password"
                                placeholder="Senha"
                                {...register("status_check_auth_password")}
                            />
                            {errors.status_check_auth_password && (
                                <span className="text-sm text-destructive">
                                    {errors.status_check_auth_password.message}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="ds_status_check_body">
                        Corpo da requisição
                        {!bodyAllowed && (
                            <span className="ml-1 font-normal text-muted-foreground">
                                (disponível apenas para POST, PUT ou PATCH)
                            </span>
                        )}
                    </Label>
                    <Textarea
                        id="ds_status_check_body"
                        placeholder="Corpo enviado na requisição (JSON, texto etc.)"
                        disabled={!bodyAllowed}
                        {...register("ds_status_check_body")}
                    />
                    {errors.ds_status_check_body && (
                        <span className="text-sm text-destructive">
                            {errors.ds_status_check_body.message}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
