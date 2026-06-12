import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { ConfirmPrivilegesModal } from "./confirm-privileges-modal"

interface PrivilegesModalProps {
    children: React.ReactNode
}

export function PrivilegesModal({
    children,
}: PrivilegesModalProps) {
    const [open, setOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    return (
        <Dialog open={open || confirmOpen} onOpenChange={setOpen}>
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
                    <form className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4 border border-primary bg-primary/10 p-4 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Usuário</span>
                                <span className="text-primary-text text-[1rem] font-semibold">Geferson Holdorf</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[.8rem] text-muted-foreground">Grupo Atual</span>
                                <span className="text-primary-text text-[1rem] font-semibold">ReadOnly</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-[.8rem]">Servidor</span>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="9">SERVIDOR BRA APP</SelectItem>
                                            <SelectItem value="2">SERVIDOR BRA INFRA</SelectItem>
                                            <SelectItem value="3">SERVIDOR BRA HOM</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-[.8rem]">Novo Nível de Privilégio</span>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="9">ADMIN</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-[.8rem]">Duração (Horas)</span>
                            <Input
                                type="number"
                                placeholder="Informa as horas..."
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-[.8rem]">Justificativa</span>
                            <Textarea
                                placeholder="Descreva o motivo desta solicitação para fins de auditoria..."
                            />
                        </div>
                    </form>
                    <div className="p-4 bg-red-50 flex items-start gap-2 border-2 border-red-300 rounded-lg">
                        <ShieldAlert className="size-5 text-red-500" />
                        <span className="text-[.8rem] text-red-500">Este acesso será revogado automaticamente após o período informado e registrado para auditoria.</span>
                    </div>
                </div>
                <DialogFooter className="pb-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <ConfirmPrivilegesModal
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onBack={() => setConfirmOpen(false)}
                        onConfirm={() => {
                            setConfirmOpen(false)
                            setOpen(false)
                        }}
                    >
                        <Button className="bg-primary" onClick={() => setConfirmOpen(true)}>
                            <ShieldCheck />
                            Conceder Privilégio
                        </Button>
                    </ConfirmPrivilegesModal>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}