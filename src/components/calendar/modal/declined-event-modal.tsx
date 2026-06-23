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
import { useDeclinedEventByUser } from "@/api/calendar/declined-event-by-user"
import { toast } from "sonner"

interface DeclinedEventModalProps {
    children: React.ReactNode
    event: Event
}

export function DeclinedEventModal({ children, event }: DeclinedEventModalProps) {
    const { mutateAsync, isPending } = useDeclinedEventByUser()

    async function handleMutationAsync() {
        try {
            await mutateAsync({
                eventId: event.id,
                sendResponse: true,
                comment: "Convite recusado pelo sistema Nexus"
            })

            toast.success("Evento recusado com sucesso.", {
                position: "top-center",
                richColors: true,
            })
        } catch (error) {
            console.error(error)
            toast.error("Erro ao recusar participação na reunião. Tente novamente.", {
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
                    <AlertDialogTitle>Deseja Recusar sua participação?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você deseja recusar sua participação no evento {event.title} que irá acontecer em {formatDateEvent(event.startAt, event.endAt)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={`${isPending && 'disabled'}`}>{isPending ? (<Loader2 className="spin-in" />) : (<X />)} Voltar</AlertDialogCancel>
                    <AlertDialogAction
                        className={`${isPending && 'disabled'}`}
                        onClick={handleMutationAsync}
                    >
                        {isPending ? (<Loader2 className="spin-in" />) : (<CheckIcon />)} Recusar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
