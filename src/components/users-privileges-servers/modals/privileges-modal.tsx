import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CreatePrivilegesRequest {
    user: string
    server: string
    group: string
    duration: number
    justify: string
}

interface PrivilegesModalProps {
    children: React.ReactNode;
    user: {
        username: string;
        name: string;
        logo: string;
        servers: {
            server: string;
            group: string;
            status: string;
            lastLogin: string | null;
        }[];
    };
}

export const createPrivilege = z.object({
    user: z.string().min(1),
    server: z.string().min(1, "Selecione um servidor"),
    group: z.string().min(1, "Selecione um nível"),
    duration: z.string().min(1, "A duração deve ser maior que 0"),
    justify: z.string().min(10, "Informe uma justificativa com pelo menos 10 caracteres"),
});

export type CreatePrivilege = z.infer<typeof createPrivilege>;

export function PrivilegesModal({
    children,
    user,
}: PrivilegesModalProps) {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { mutateAsync } = useMutation({
        mutationKey: ["create-privileges"],
        mutationFn: async (data: CreatePrivilegesRequest) => {
            const response = await fetch(
                "http://127.0.0.1:3336/servers/create/privileges",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...data,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar privilégios");
            }

            return response.json();
        },
    });

    const {
        register,
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<CreatePrivilege>({
        resolver: zodResolver(createPrivilege),
        defaultValues: {
            user: user.username,
            server: "",
            group: "",
            duration: "",
            justify: "",
        },
    });

    const handleOnSubmit = async (data: CreatePrivilege) => {
        console.log("Form Submitted:", data);

        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        const data = getValues();

        try {
            console.log(data)
            await mutateAsync({
                duration: Number(data.duration),
                group: data.group,
                justify: data.justify,
                server: data.server,
                user: data.user,
            })

            toast.success("Privilégio atribuído com sucesso.", {
                position: "top-center",
                richColors: true,
            })
        } catch (error) {
            console.error(error)

            toast.error("Erro ao atribuir privilégio.", {
                position: "top-center",
                richColors: true,
            })
        }

        setConfirmOpen(false);
        setOpen(false);

        reset();
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <span>{children}</span>
                </DialogTrigger>

                <DialogContent
                    onClick={(e) => e.stopPropagation()}
                    className="w-2/5 p-2 z-50"
                >
                    <DialogHeader className="border-b bg-muted/40 p-6">
                        <DialogTitle className="text-[1.1rem]">
                            Conceder Privilégio Temporário para {user.name}
                        </DialogTitle>
                    </DialogHeader>

                    {!confirmOpen ? (
                        <form
                            onSubmit={handleSubmit(handleOnSubmit)}
                            className="p-4 space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-[.8rem]">
                                        Servidor
                                    </span>

                                    <Controller
                                        control={control}
                                        name="server"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="SERVIDOR-BRA-APP">
                                                            SERVIDOR-BRA-APP
                                                        </SelectItem>

                                                        <SelectItem value="SERVIDOR-BRA-INFRA">
                                                            SERVIDOR-BRA-INFRA
                                                        </SelectItem>

                                                        <SelectItem value="SERVIDOR-BRA-HOM">
                                                            SERVIDOR-BRA-HOM
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {errors.server && (
                                        <span className="text-sm text-red-500">
                                            {errors.server.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-[.8rem]">
                                        Novo Nível de Privilégio
                                    </span>

                                    <Controller
                                        control={control}
                                        name="group"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="ADMINS">
                                                            ADMINS
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {errors.group && (
                                        <span className="text-sm text-red-500">
                                            {errors.group.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-[.8rem]">
                                    Duração (Horas)
                                </span>

                                <Input
                                    type="number"
                                    placeholder="Informe as horas..."
                                    {...register("duration")}
                                />

                                {errors.duration && (
                                    <span className="text-sm text-red-500">
                                        {errors.duration.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-[.8rem]">
                                    Justificativa
                                </span>

                                <Textarea
                                    placeholder="Descreva o motivo desta solicitação para fins de auditoria..."
                                    {...register("justify")}
                                />

                                {errors.justify && (
                                    <span className="text-sm text-red-500">
                                        {errors.justify.message}
                                    </span>
                                )}
                            </div>

                            <div className="p-4 bg-red-50 flex items-start gap-2 border border-red-300 rounded-lg">
                                <ShieldAlert className="size-5 text-red-500" />

                                <span className="text-[.8rem] text-red-500">
                                    Este acesso será revogado automaticamente após o
                                    período informado e registrado para auditoria.
                                </span>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancelar
                                </Button>


                                <Button type="submit">
                                    <ShieldCheck />
                                    Conceder Privilégio
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <div className="p-4 space-y-4">
                            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-sm flex flex-col space-y-3">
                                <span className="font-bold text-[.9rem] text-primary">Resumo da Confirmação</span>
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[.8rem] text-muted-foreground">Usuário</span>
                                        <span className="text-[.9rem] font-semibold text-primary-text">{user.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[.8rem] text-muted-foreground">Novo Grupo</span>
                                        <span className="text-[.9rem] font-semibold text-primary-text">{getValues("group")}</span>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[.8rem] text-muted-foreground">Servidor</span>
                                        <span className="text-[.9rem] font-semibold text-primary-text">{getValues("server")}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[.8rem] text-muted-foreground">Duração</span>
                                        <span className="text-[.9rem] font-semibold text-primary-text">{getValues("duration")} Horas</span>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[.8rem] text-muted-foreground">Espiração extimada</span>
                                        <span className="text-[.9rem] font-semibold text-primary-text">{new Date(
                                            Date.now() + Number(getValues("duration")) * 60 * 60 * 1000
                                        ).toLocaleString("pt-BR")}</span>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[.8rem] text-muted-foreground">Justificativa</span>
                                        <span className="text-[.9rem] font-semibold text-primary-text">{getValues("justify")}</span>
                                    </div>
                                </div>

                            </div>
                            <DialogFooter className="pb-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setConfirmOpen(false)}
                                >
                                    Voltar
                                </Button>
                                <Button className="bg-primary" onClick={handleConfirm}>
                                    <ShieldCheck />
                                    Confirmar Privilégio
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
        </>
    );
}