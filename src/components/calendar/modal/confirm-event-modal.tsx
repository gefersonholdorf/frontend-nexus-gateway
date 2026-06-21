import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckIcon, Loader2, X } from "lucide-react"
import type React from "react"
import type { Event } from "../drawer-events"
import { formatDateEvent } from "../events-waiting-confirm"
import { useConfirmEventByUser } from "@/api/calendar/confirm-event-by-user"
import { toast } from "sonner"

interface ConfirmEventModalProps {
    children: React.ReactNode
    event: Event
}

export function ConfirmEventModal({ children, event }: ConfirmEventModalProps) {
    const { mutateAsync, isPending } = useConfirmEventByUser()

    async function handleMutationAsync() {
        try {
            await mutateAsync({
                eventId: event.id,
                sendResponse: true,
                comment: "Convite aceito pelo sistema Nexus"
            })

            toast.success("Confirmação realizada com sucesso.", {
                position: "top-center",
                richColors: true,
            })
        } catch (error) {
            console.error(error)
            toast.error("Erro ao confirmar participação na reunião. Tente novamente.", {
                position: "top-center",
                richColors: true,
            })
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent size="default">
                <AlertDialogHeader>
                    <AlertDialogTitle>Deseja confirmar sua participação?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você deseja confirmar sua participação no evento {event.title} que irá acontecer em {formatDateEvent(event.startAt, event.endAt)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={`${isPending && 'disabled'}`}>{isPending ? (<Loader2 className="spin-in" />) : (<X />)} Voltar</AlertDialogCancel>
                    <AlertDialogAction
                        className={`${isPending && 'disabled'}`}
                        onClick={handleMutationAsync}
                    >
                        {isPending ? (<Loader2 className="spin-in" />) : (<CheckIcon />)} Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
