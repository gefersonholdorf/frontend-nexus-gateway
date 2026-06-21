import {
    CalendarCheckIcon,
    CheckCircle2,
    CircleDashed,
    CircleX,
    Clock3,
    Coffee,
    Moon,
    Plane
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";

export interface Availability {
    name: string;
    logo: string | null;
    scheduleId: string;
    presence: Presence
    availabilityView: string;
    scheduleItems: {
        isPrivate?: boolean;
        status: string;
        subject?: string;
        location?: string;
        isMeeting?: boolean;
        isRecurring?: boolean;
        isException?: boolean;
        isReminderSet?: boolean;
        start: {
            dateTime: string;
            timeZone: string;
        };
        end: {
            dateTime: string;
            timeZone: string;
        };
    }[];
}

export interface Presence {
    id: number;
    name: string;
    email: string;
    roleDescription: string;
    logo: string | null;
    availability: string;
    activity: string;
}

interface AvailabilityComponentProps {
    presences: Presence[];
    availabilitys: Availability[];
    onSelectedUser: (user: Availability) => void;
}

const availabilityConfig = {
    Available: {
        label: "Disponível",
        color: "bg-emerald-500",
        icon: CheckCircle2,
    },

    AvailableIdle: {
        label: "Disponível (Inativo)",
        color: "bg-emerald-400",
        icon: Coffee,
    },

    Busy: {
        label: "Ocupado",
        color: "bg-red-500",
        icon: CircleX,
    },

    BusyIdle: {
        label: "Ocupado (Inativo)",
        color: "bg-red-400",
        icon: Clock3,
    },

    Away: {
        label: "Ausente",
        color: "bg-amber-500",
        icon: Plane,
    },

    BeRightBack: {
        label: "Volto Já",
        color: "bg-yellow-500",
        icon: Coffee,
    },

    DoNotDisturb: {
        label: "Não Perturbe",
        color: "bg-red-700",
        icon: CircleX,
    },

    Offline: {
        label: "Offline",
        color: "bg-gray-500",
        icon: Moon,
    },

    PresenceUnknown: {
        label: "Desconhecido",
        color: "bg-gray-400",
        icon: CircleDashed,
    },
};

export function AvailabilityComponent({
    presences,
    availabilitys,
    onSelectedUser,
}: AvailabilityComponentProps) {
    return (
        <Card
            className="
                w-full
                border
                border-border
                bg-(image:--background-gradient)
                shadow-lg
                rounded-lg
                transition-all
                duration-300
                hover:shadow-xl
            "
        >
            <CardHeader className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary hover:bg-background">
                        <CalendarCheckIcon className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Disponibilidade da Equipe
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Status em Tempo Real - Microsoft Teams
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-3">
                {presences.map((user) => {
                    const availability =
                        availabilityConfig[
                        user.availability as keyof typeof availabilityConfig
                        ] ?? availabilityConfig.PresenceUnknown;

                    const StatusIcon = availability.icon;

                    const availabilityUser = availabilitys.find(
                        (item) =>
                            item.scheduleId.toLowerCase() ===
                            user.email.toLowerCase()
                    );

                    return (
                        <div
                            key={user.id}
                            className="
                                flex
                                justify-between
                                items-center
                                gap-4
                                rounded-lg
                                border
                                border-border
                                p-3
                                hover:bg-card
                                cursor-pointer
                                transition-colors
                            "
                            onClick={() => {
                                if (availabilityUser) {
                                    onSelectedUser(availabilityUser);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={user.logo ?? ""}
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                .split(" ")
                                                .slice(0, 2)
                                                .map((v) => v[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div
                                        className={`
                                            absolute
                                            bottom-0
                                            right-0
                                            h-3
                                            w-3
                                            rounded-full
                                            border-2
                                            border-background
                                            ${availability.color}
                                        `}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-[.85rem] font-semibold">
                                        {user.name}
                                    </span>

                                    <span className="text-[.7rem] text-muted-foreground">
                                        {user.roleDescription}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1 text-[.75rem]">
                                    <StatusIcon className="size-4" />
                                    {availability.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}