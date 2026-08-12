import { useGetUsersByCampaign, type UserCampaign } from "@/api/campaigns/get-users-by-campaign";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { formatDate } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { TableComponent, type Column } from "../table-component";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const columns: Column<UserCampaign>[] = [
    {
        key: "id",
        title: "Usuário",
        render: (_, row) => {
            return (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={row.avatarUrl ?? ""} />
                                <AvatarFallback className="bg-primary/90 text-white text-xs">
                                    {row.name[0]}
                                    {row.name.split(" ").length > 1
                                        ? row.name.split(" ")[1][0]
                                        : ""}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className="flex flex-col">
                            <p>{row.name}</p>
                            <p>{row.email}</p>
                        </TooltipContent>
                    </Tooltip>
                    <div className="flex flex-col">
                        <span className="text-sm truncate max-w-28">
                            {row.name}
                        </span>
                        <span className="text-[.8rem] text-muted-foreground truncate max-w-28">
                            {row.email}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        key: "email",
        title: "Status",
        render: (_, row) => (
            <div className="flex items-center gap-1">
                {row.stats.status === 'Não visualizou' && (
                    <Badge className="bg-transparent text-gray-500 border border-border">
                        <EyeOff className="size-4 mr-1 text-gray-500" />
                        Não Visualizou
                    </Badge>
                )}
                {row.stats.status === 'Visualizou, não acessou' && (
                    <Badge className="bg-transparent text-blue-500 border border-border">
                        <Eye className="size-4 mr-1 text-blue-500" />
                        Visualizou, não acessou
                    </Badge>
                )}
                {row.stats.status === 'Visualizou e acessou' && (
                    <Badge className="bg-transparent text-emerald-500 border border-border">
                        <Eye className="size-4 mr-1 text-emerald-500" />
                        Visualizou e acessou
                    </Badge>
                )}
            </div>
        )
    },
    {
        key: "name",
        title: "Data de Visualização",
        render: (_, row) => (
            <div className="text-sm">
                {row.stats.dateView ? (formatDate(row.stats.dateView.toString(), "dd/MM/yyyy HH:mm")) : "---"}
            </div>
        )
    },
    {
        key: "stats",
        title: "Data do Acesso",
        render: (_, row) => (
            <div className="text-sm">
                {row.stats.dateAccess ? (formatDate(row.stats.dateAccess.toString(), "dd/MM/yyyy HH:mm")) : "---"}
            </div>
        )
    }
];

interface CampaignFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaignId: number | null
}

export function UserByCampaignComponent({ open, onOpenChange, campaignId }: CampaignFormModalProps) {
    const { data, isLoading, isError } = useGetUsersByCampaign({
        campaignId: campaignId
    });
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="border-b bg-muted/40 p-6">
                    <div className="flex gap-4 items-center">
                        <div className="p-2 ro">
                            <Eye className="size-5 text-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <DialogTitle>Acompanhamento</DialogTitle>
                            <DialogDescription>Visualize quem acompanha esta campanha e o status de visualização e acesso.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="px-6 pt-4">
                    <div className="rounded-xl border border-border bg-background/50 px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Visualizou e acessou */}
                            <div className="flex items-start gap-3">
                                <Eye className="size-5 mt-0.5 shrink-0 text-emerald-500" />

                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-emerald-500">
                                        Visualizou e acessou
                                    </span>

                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                        O usuário visualizou a campanha e acessou seu conteúdo.
                                    </span>
                                </div>
                            </div>

                            {/* Visualizou, não acessou */}
                            <div className="flex items-start gap-3">
                                <Eye className="size-5 mt-0.5 shrink-0 text-blue-500" />

                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-blue-500">
                                        Visualizou, não acessou
                                    </span>

                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                        O usuário visualizou a campanha, mas ainda não acessou.
                                    </span>
                                </div>
                            </div>

                            {/* Não visualizou */}
                            <div className="flex items-start gap-3">
                                <EyeOff className="size-5 mt-0.5 shrink-0 text-muted-foreground" />

                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-muted-foreground">
                                        Não visualizou
                                    </span>

                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                        O usuário ainda não visualizou a campanha.
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <TableComponent
                        data={data?.users ?? []}
                        registerName="Usuários"
                        isLoading={isLoading}
                        isError={isError}
                        onRetry={() => { }}
                        columns={columns}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}