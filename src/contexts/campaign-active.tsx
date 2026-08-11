import type { Campaign } from "@/api/campaigns/fetch-campaigns";
import { Bell, CalendarDays, ExternalLink, Info, X } from "lucide-react";

interface CampaignNotificationModalProps {
    campaign: Campaign | null;
    onAccess: (campaign: Campaign) => void;
    onDismiss: () => void;
}

export function CampaignNotificationModal({ campaign, onAccess, onDismiss }: CampaignNotificationModalProps) {
    if (!campaign) {
        return null;
    }

    const publishedDate = new Date(campaign.publishDate!).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-(image:--background-gradient) p-8 shadow-2xl">
                <button type="button" onClick={onDismiss} className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <X className="size-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10">
                        <Bell className="size-12 text-primary" />
                    </div>

                    <h2 className="text-2xl font-bold text-foreground">
                        Nova campanha disponível!
                    </h2>

                    <div className="flex gap-2 justify-center">
                        <span className="mt-4 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            {campaign.monthYear}
                        </span>
                        <span className="mt-4 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            {campaign.title}
                        </span>
                    </div>

                    <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
                        {campaign.description}
                    </p>

                    <div className="my-6 h-px w-full bg-border" />

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                        <span>Publicado em {publishedDate}</span>
                    </div>

                    <div className="mt-6 grid w-full grid-cols-2 gap-4">
                        <button type="button" onClick={() => onAccess(campaign)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                            Acessar campanha
                            <ExternalLink className="size-4" />
                        </button>

                        <button type="button" onClick={onDismiss} className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-transparent px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5">
                            Lembrar depois
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}