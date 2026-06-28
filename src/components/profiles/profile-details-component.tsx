import type { Profile } from "@/pages/profiles-page";
import { Card, CardHeader } from "../ui/card";

interface ProfileDeatilsComponentProps {
    profile?: Profile
    isLoading: boolean
    isError: boolean
}

export function ProfileDeatilsComponent({profile}: ProfileDeatilsComponentProps) {
    return (
        <Card
            className={`h-fit flex flex-col items-center justify-start border border-border rounded-lg shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                        hover:shadow-sm gap-6 bg-(image:--background-gradient)`}
        >
            <CardHeader>
                <h2 className="text-primary-text">Dados do Perfil</h2>
                <span className="text-[.8rem] text-muted-foreground">Informações Básicas do perfil</span>
            </CardHeader>
        </Card>
    )
}