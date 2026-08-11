interface TicketStatus {
    id: number
    name: string
    quantity: number
}

interface FilteringStatusTicketsComponentProps {
    status: number
    onSetStatus: (status: number) => void
    ticketStatus: TicketStatus[]
}

export function FilteringStatusTicketsComponent({ status, onSetStatus, ticketStatus }: FilteringStatusTicketsComponentProps) {
    return (
        <div className="grid grid-cols-8 gap-1 p-2">
            {ticketStatus.map((ticket) => {
                const selected = ticket.id === status;

                return (
                    <button
                        key={ticket.id}
                        className={`group cursor-pointer w-full rounded-lg border px-4 py-1 transition-all duration-200 flex items-center justify-between  hover:border-primary hover:bg-accent
                    ${selected ? "border-primary bg-primary/10" : "border-border bg-(image:--background-gradient)"}
                    `}
                        onClick={() => onSetStatus(ticket.id)}
                    >
                        <div className="flex items-center gap-2">
                            <span className={selected ? "font-medium text-primary" : "text-muted-foreground group-hover:text-primary"}>
                                {ticket.name}
                            </span>
                        </div>

                        <span
                            className={`
                        min-w-7 border border-border
                        h-7
                        rounded-full
                        text-xs
                        font-semibold
                        flex
                        items-center
                        justify-center
                        ${selected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }
                    `}
                        >
                            {ticket.quantity}
                        </span>
                    </button>
                );
            })}
        </div>
    )
}