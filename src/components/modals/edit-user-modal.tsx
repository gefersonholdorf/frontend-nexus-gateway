import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Camera, Save, UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
    DialogDescription,
} from "@/components/ui/dialog";

interface EditUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
        id: number;
        username: string;
        name: string;
        email: string;
        photo?: string;
    };
}

const editUserSchema = z.object({
    name: z.string().min(3, "Informe um nome válido"),
});

type EditUserForm = z.infer<typeof editUserSchema>;

export function EditUserModal({
    user,
    open,
    onOpenChange
}: EditUserModalProps) {
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditUserForm>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name,
        },
    });

    useEffect(() => {
        reset({
            name: user.name,
        });

        setPreview(user.photo || "");
    }, [user, reset]);

    const { mutateAsync, isPending } = useMutation({
        mutationKey: ["update-user", user.id],
        mutationFn: async (data: FormData) => {
            const response = await fetch(
                `http://127.0.0.1:3336/users/${user.id}`,
                {
                    method: "PUT",
                    body: data,
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar usuário");
            }

            return response.json();
        },
    });

    const handlePhotoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setPhoto(file);

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
    };

    const handleUpdate = async (
        data: EditUserForm
    ) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);

            if (photo) {
                formData.append("photo", photo);
            }

            await mutateAsync(formData);

            toast.success(
                "Usuário atualizado com sucesso.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );

            onOpenChange(false);
        } catch (error) {
            console.error(error);

            toast.error(
                "Erro ao atualizar usuário.",
                {
                    position: "top-center",
                    richColors: true,
                }
            );
        }
    };

    return (
        <Dialog open={open}
            onOpenChange={onOpenChange}>
            {/* <DialogTrigger asChild>
                <span>{children}</span>
            </DialogTrigger> */}

            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="border-b bg-muted/40 p-6">
                    <DialogTitle>
                        Editar Usuário
                    </DialogTitle>

                    <DialogDescription>
                        <DialogDescription>
                            Atualize as informações do usuário.
                        </DialogDescription>
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(handleUpdate)}
                    className="space-y-6 p-6"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Foto"
                                    className="h-28 w-28 rounded-full border object-cover"
                                />
                            ) : (
                                <div className="flex h-28 w-28 items-center justify-center rounded-full border bg-muted">
                                    <UserRound className="size-12 text-muted-foreground" />
                                </div>
                            )}

                            <label
                                htmlFor="photo"
                                className="absolute bottom-0 right-0 cursor-pointer rounded-full border bg-background p-2 shadow"
                            >
                                <Camera className="size-4" />
                            </label>

                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </div>

                        <span className="text-sm text-muted-foreground">
                            Clique no ícone para alterar a foto
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nome Completo</Label>

                            <Input
                                {...register("name")}
                            />

                            {errors.name && (
                                <span className="text-sm text-red-500">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Usuário</Label>

                            <Input
                                disabled
                                value={user.username}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>E-mail</Label>

                        <Input
                            disabled
                            type="email"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            <Save />

                            {isPending
                                ? "Salvando..."
                                : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

