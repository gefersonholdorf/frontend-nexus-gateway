import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { EventDetails } from "./event-details"

export interface Event {
    id: string,
    title: string,
    startAt: string,
    endAt: string,
    organizer: {
        name: string,
        email: string
    },
    attendees:
    {
        name: string,
        email: string,
        response: string
    }[],
    isOnline: boolean,
    location: string,
    webLink: string
}

interface DrawerScrollableContentProps {
    open: boolean
    onOpenChange: () => void
    events: Event[]
}

export function DrawerScrollableContent({ open, onOpenChange, events }: DrawerScrollableContentProps) {
    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="">
                <DrawerHeader>
                    <DrawerTitle>Eventos do Dia</DrawerTitle>
                    <DrawerDescription>5 compromissos</DrawerDescription>
                </DrawerHeader>
                <div className="no-scrollbar overflow-y-auto px-4 space-y-4">
                    {events.map((event) => (
                        <EventDetails key={event.id} event={event} />
                    ))}
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
