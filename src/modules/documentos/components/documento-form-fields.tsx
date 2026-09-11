import {
    Controller,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";

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

import { DocRolesCheckboxGroup } from "./doc-roles-checkbox-group";
import type { DocumentoFormValues } from "./documento-form-schema";
import { SelectDocArea } from "./select-doc-area";
import { SelectDocCategoria } from "./select-doc-categoria";
import { SelectDocFluxo } from "./select-doc-fluxo";
import { SelectDocResponsavel } from "./select-doc-responsavel";

interface DocumentoFormFieldsProps {
    register: UseFormRegister<DocumentoFormValues>;
    errors: FieldErrors<DocumentoFormValues>;
    control: Control<DocumentoFormValues>;
}

export function DocumentoFormFields({ register, errors, control }: DocumentoFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="ds_titulo">Título</Label>
                <Input id="ds_titulo" placeholder="Ex.: Política de Segurança da Informação" {...register("ds_titulo")} />
                {errors.ds_titulo && (
                    <span className="text-sm text-destructive">{errors.ds_titulo.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ds_descricao">Descrição</Label>
                <Textarea id="ds_descricao" placeholder="Descreva o propósito do documento" {...register("ds_descricao")} />
                {errors.ds_descricao && (
                    <span className="text-sm text-destructive">{errors.ds_descricao.message}</span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="cd_categoria">Categoria</Label>
                    <Controller
                        control={control}
                        name="cd_categoria"
                        render={({ field }) => (
                            <SelectDocCategoria
                                id="cd_categoria"
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                            />
                        )}
                    />
                    {errors.cd_categoria && (
                        <span className="text-sm text-destructive">{errors.cd_categoria.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cd_area">Área</Label>
                    <Controller
                        control={control}
                        name="cd_area"
                        render={({ field }) => (
                            <SelectDocArea
                                id="cd_area"
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                            />
                        )}
                    />
                    {errors.cd_area && (
                        <span className="text-sm text-destructive">{errors.cd_area.message}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
                <div className="space-y-2">
                    <Label htmlFor="st_modo_codigo">Código</Label>
                    <Controller
                        control={control}
                        name="st_modo_codigo"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="st_modo_codigo" className="w-full sm:w-44">
                                    <SelectValue placeholder="Modo do código" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AUTOMATICO">Automático</SelectItem>
                                    <SelectItem value="MANUAL">Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ds_codigo">
                        Código manual
                        <span className="font-normal text-muted-foreground"> (formato SIGLA SIGLA NNN)</span>
                    </Label>
                    <Input
                        id="ds_codigo"
                        placeholder="Ex.: POL SGSI 001"
                        {...register("ds_codigo")}
                    />
                    {errors.ds_codigo && (
                        <span className="text-sm text-destructive">{errors.ds_codigo.message}</span>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="cd_responsavel">Responsável</Label>
                <Controller
                    control={control}
                    name="cd_responsavel"
                    render={({ field }) => (
                        <SelectDocResponsavel
                            id="cd_responsavel"
                            value={field.value || undefined}
                            onValueChange={field.onChange}
                        />
                    )}
                />
                {errors.cd_responsavel && (
                    <span className="text-sm text-destructive">{errors.cd_responsavel.message}</span>
                )}
                <p className="text-xs text-muted-foreground">
                    O responsável deve possuir ao menos uma das roles associadas ao documento.
                </p>
            </div>

            <div className="space-y-2">
                <Label>Roles associadas</Label>
                <Controller
                    control={control}
                    name="roles"
                    render={({ field }) => (
                        <DocRolesCheckboxGroup value={field.value} onChange={field.onChange} />
                    )}
                />
                {errors.roles && (
                    <span className="text-sm text-destructive">{errors.roles.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="cd_fluxo_aprovacao">Fluxo de aprovação</Label>
                <Controller
                    control={control}
                    name="cd_fluxo_aprovacao"
                    render={({ field }) => (
                        <SelectDocFluxo
                            id="cd_fluxo_aprovacao"
                            value={field.value}
                            onValueChange={field.onChange}
                        />
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    Opcional. Sem fluxo, a aprovação da revisão publica o documento diretamente (RF016).
                </p>
            </div>
        </div>
    );
}
