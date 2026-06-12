import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { ShieldCheck } from "lucide-react"
import type React from "react"

interface PrivilegesModalProps {
    children: React.ReactNode
    open: boolean
    setOpen: (v: boolean) => void
    onConfirm: () => void
    onBack: () => void
}

export function ConfirmPrivilegesModal({
    open,
    setOpen,
    onConfirm,
    children,
    onBack
}: PrivilegesModalProps) {
    return (
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
                        Conceder Privilégio Temporário
                    </DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-4">
                    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-sm flex flex-col space-y-3">
                        <span className="font-bold text-[.9rem] text-primary">Resumo da Confirmação</span>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Usuário</span>
                                <span className="text-[.9rem] font-semibold text-primary-text">Geferson Holdorf</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Novo Grupo</span>
                                <span className="text-[.9rem] font-semibold text-primary-text">ADMIN</span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Servidor</span>
                                <span className="text-[.9rem] font-semibold text-primary-text">SERVER BRA HOM</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Duração</span>
                                <span className="text-[.9rem] font-semibold text-primary-text">8 horas</span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Espiração extimada</span>
                                <span className="text-[.9rem] font-semibold text-primary-text">12/06/2026 08:00</span>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="pb-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                    >
                        Voltar
                    </Button>
                    <Button className="bg-primary" onClick={onConfirm}>
                        <ShieldCheck />
                        Confirmar Privilégio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}