import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

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

import type { HubServiceFormInput, HubServiceFormValues } from "./hub-service-form-schema";

interface HubServiceFormFieldsProps {
    register: UseFormRegister<HubServiceFormInput>;
    errors: FieldErrors<HubServiceFormInput>;
    control: Control<HubServiceFormInput, unknown, HubServiceFormValues>;
}

export function HubServiceFormFields({ register, errors, control }: HubServiceFormFieldsProps) {
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
        </div>
    );
}
