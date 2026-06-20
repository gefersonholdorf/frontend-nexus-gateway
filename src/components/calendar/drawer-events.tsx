import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { EventDetails } from "./event-details";

export interface Event {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    organizer: {
        name: string;
        email: string;
        logo?: string | null
    };
    attendees: {
        name: string;
        email: string;
        logo?: string | null
        response: string;
    }[];
    isOnline: boolean;
    location: string;
    webLink: string;
}

interface DrawerScrollableContentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    events: Event[];
}

export function DrawerScrollableContent({
    open,
    onOpenChange,
    events,
}: DrawerScrollableContentProps) {
    const eventCount = events.length;

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex h-full w-full max-w-md flex-col">
                {/* HEADER */}
                <DrawerHeader className="border-b bg-muted/30">
                    <DrawerTitle className="text-lg font-semibold">
                        Agenda do dia
                    </DrawerTitle>

                    <DrawerDescription className="text-sm">
                        {eventCount === 0 ? (
                            "Nenhum compromisso encontrado"
                        ) : (
                            <>
                                <strong>{eventCount}</strong>{" "}
                                {eventCount === 1 ? "evento" : "eventos"} programado
                                {eventCount > 1 ? "s" : ""}
                            </>
                        )}
                    </DrawerDescription>
                </DrawerHeader>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {eventCount === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center text-sm text-muted-foreground">
                                <p className="font-medium">Tudo em ordem</p>
                                <p className="text-xs">Sem eventos neste período</p>
                            </div>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div
                                key={event.id}
                                className="rounded-lg border bg-background shadow-sm transition hover:shadow-md"
                            >
                                <EventDetails event={event} />
                            </div>
                        ))
                    )}
                </div>

                {/* FOOTER */}
                <DrawerFooter className="border-t bg-muted/20">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Fechar
                        </Button>

                        <DrawerClose asChild>
                            <Button className="flex-1">Ok</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}