import { useDeleteDocument } from "@/api/documents/delete-document";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDocumentModalProps {
    id: number
    children: React.ReactNode
}


export function DeleteDocumentModal({
    id,
    children
}: DeleteDocumentModalProps) {
    const [open, setOpen] = useState(false);
    const { mutateAsync, isPending } = useDeleteDocument()

    async function handleDeleteDocument() {
        try {
            await mutateAsync(id)

            toast.success("Documento deletado com sucesso!", {
                position: "top-center",
                richColors: true,
            });
        } catch (error) {
            toast.error("Erro ao deletar documento!", {
                position: "top-center",
                richColors: true,
            });
        } finally {
            setOpen(false)
        }
    }
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
                    <DialogHeader className="bg-muted/40 p-6">
                        <DialogTitle className="text-[1.1rem]">
                            Este documento será removido, deseja confirmar a deleção?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={isPending}
                            type="submit"
                            onClick={handleDeleteDocument}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
}