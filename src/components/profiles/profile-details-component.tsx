import type { Profile } from "@/pages/profiles-page";
import { CheckCircle, ShieldCog, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProfileDeatilsComponentProps {
    profile?: Profile
    isLoading: boolean
    isError: boolean
}

export function ProfileDeatilsComponent({ profile }: ProfileDeatilsComponentProps) {
    const grantedPermissions = profile?.permissions.length ?? 0;
    const totalPermissions = profile?.countTotalPermissions ?? 0;

    const percentage =
        totalPermissions > 0
            ? Math.round((grantedPermissions / totalPermissions) * 100)
            : 0;
    return (
        <Card
            className={`h-fit w-full flex flex-col items-center justify-start border border-border rounded-lg shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                        hover:shadow-sm gap-6 bg-(image:--background-gradient)`}
        >
            <CardHeader className="w-full">
                <h2 className="text-primary-text font-bold text-lg">Dados do Perfil</h2>
                <span className="text-[.8rem] text-muted-foreground">Informações Básicas do perfil</span>
            </CardHeader>
            <CardContent className="w-full space-y-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <span className="text-[.8rem]">Nome do Perfil</span>
                        <Input
                            className="w-full"
                            value={profile?.title}
                        />
                    </div>
                    <div>
                        <span className="text-[.8rem]">Descrição</span>
                        <Textarea
                            className="w-full"
                            value={profile?.description ?? ''}
                        />
                    </div>
                    <div>
                        <span className="text-[.8rem]">Status</span>
                        <Textarea
                            className="w-full"
                            value={profile?.description ?? ''}
                        />
                    </div>
                    <div>
                        <span className="text-[.8rem]">Descrição</span>
                        <Input
                            disabled
                            className="w-full"
                            value={profile?.createdAt ?? ''}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-semibold text-[.9rem]">Resumo do Perfil</span>
                    <div className="flex gap-2 items-center w-full border border-border bg-card p-2 rounded-sm">
                        <div className="p-2 border border-border rounded-sm">
                            <Users className="text-blue-500 size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold">{profile?.countUsers}</span>
                            <span className="text-[.8rem] text-muted-foreground">Usuários</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center w-full border border-border bg-card p-2 rounded-sm">
                        <div className="p-2 border border-border rounded-sm">
                            <ShieldCog className="text-purple-500 size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold">{profile?.permissions.length} / {profile?.countTotalPermissions}</span>
                            <span className="text-[.8rem] text-muted-foreground">Permissões Concedidas</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center w-full border border-border bg-card p-2 rounded-sm">
                        <div className="p-2 border border-border rounded-sm">
                            <CheckCircle className="text-emerald-500 size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold">{percentage}%</span>
                            <span className="text-[.8rem] text-muted-foreground">Acesso Concedido</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}