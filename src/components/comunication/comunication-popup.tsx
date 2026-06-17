import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Rocket, Users, Megaphone } from "lucide-react";

type Type = "DEPLOYMENT" | "MEETING" | "GENERAL" | "INCIDENT";

interface Communication {
    id: string;
    title: string;
    description: string;
    type: Type;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdAt: Date;
}

interface Props {
    open: boolean;
    communication: Communication | null;
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
}

function getIcon(type: Type) {
    switch (type) {
        case "DEPLOYMENT":
            return Rocket;
        case "MEETING":
            return Users;
        case "INCIDENT":
            return AlertTriangle;
        default:
            return Megaphone;
    }
}

function getPriorityStyle(priority: string) {
    switch (priority) {
        case "HIGH":
            return "text-red-500 border-red-500/30 bg-red-500/10";
        case "MEDIUM":
            return "text-orange-500 border-orange-500/30 bg-orange-500/10";
        default:
            return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    }
}

export function CommunicationModal({
    open,
    communication,
    onClose,
    onMarkAsRead
}: Props) {
    if (!communication) return null;

    const Icon = getIcon(communication.type);

    const handleClose = () => {
        onMarkAsRead(communication.id);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">

                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Icon className="size-5 text-primary" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">
                                {communication.title}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Comunicado do sistema
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* CONTENT */}
                <div className="space-y-4 pt-2">

                    <div className="flex items-center gap-2">
                        <Badge className={getPriorityStyle(communication.priority)}>
                            {communication.priority}
                        </Badge>

                        <Badge variant="outline">
                            {communication.type}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                            {communication.createdAt.toLocaleString()}
                        </span>
                    </div>

                    <div className="text-sm text-muted-foreground leading-relaxed">
                        {communication.description}
                    </div>

                    {/* SIMULANDO CONTEÚDO MAIS RICO */}
                    <div className="p-4 rounded-lg border bg-muted/30 text-sm">
                        Este comunicado faz parte das atualizações recentes do sistema.
                        Recomendamos que revise as mudanças para garantir o alinhamento
                        com as novas regras operacionais.
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>

                    <Button onClick={handleClose}>
                        Marcar como lido
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}