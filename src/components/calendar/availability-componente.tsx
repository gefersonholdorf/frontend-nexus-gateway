import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness, CalendarCheckIcon, Camera, Loader, Moon, WifiIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvailabilityResponse {
    availabilitys: {
        name: string
        logo: string | null
        scheduleId: string
        availabilityView: string
    }[]
}

export function AvailabilityComponente() {
    const { user } = useUser()
    const query = useQuery({
        queryKey: ["availability"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar/availability`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            const result = await response.json() as AvailabilityResponse;

            return result;
        },
        refetchInterval: 30000,
    });

    if (query.isLoading) {
        return (
            <Card className="h-52 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    return (
        <Card className="
                h-fit w-full
                rounded-2xl
                border
                border-border
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
            ">
            <CardHeader className="flex justify-between items-center gap-6 ">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary hover:bg-background">
                        <CalendarCheckIcon className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Disponibilidade da Equipe
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Status em tempo real
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
                {query.data.availabilitys.map((item) => (
                    <div key={item.scheduleId} className="flex justify-between gap-4 items-center rounded-sm p-3 px-3 hover:bg-card">
                        <div className="flex items-center gap-2">
                            <div className="relative h-fit w-fit">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={item.logo ? item.logo : ''} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div
                                    className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-background"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-primary-text text-[.8rem] font-semibold">{item.name}</span>
                                <span className="text-muted-foreground text-[.7rem]">Admin</span>
                            </div>
                        </div>
                        {item.availabilityView === '0' && (<span className="flex items-center gap-1 text-muted-foreground text-[.7rem]"><WifiIcon className="size-3" />Livre</span>)}
                        {item.availabilityView === '1' && (<span className="flex items-center gap-1 text-muted-foreground text-[.7rem]"><Loader className="size-3" />Compromisso</span>)}
                        {item.availabilityView === '2' && (<span className="flex items-center gap-1 text-muted-foreground text-[.7rem]"><Camera className="size-3" />Ocupado</span>)}
                        {item.availabilityView === '3' && (<span className="flex items-center gap-1 text-muted-foreground text-[.7rem]"><Moon className="size-3" />Fora do Escritório</span>)}
                        {item.availabilityView === '4' && (<span className="flex items-center gap-1 text-muted-foreground text-[.7rem]"><BriefcaseBusiness className="size-3" />Trabalhando em Outro Local</span>)}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}