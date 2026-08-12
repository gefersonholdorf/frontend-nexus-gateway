import { useAcessedCampaign } from "@/api/campaigns/acessed-campaign";
import { useDismissedCampaign } from "@/api/campaigns/dismissed-campaign";
import type { Campaign } from "@/api/campaigns/fetch-campaigns";
import { useGetCampaignActive } from "@/api/campaigns/get-campaign-active";
import { useSeenCampaign } from "@/api/campaigns/seen-campaign";
import { Bell, CalendarDays, ExternalLink, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

interface CampaignNotificationModalProps {
    campaign: Campaign | null;
    onAccess: (campaign: Campaign) => void;
    onDismiss: (campaign: Campaign) => void;
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
            <div className="relative w-fit min-w-150 rounded-2xl border border-border bg-(image:--background-gradient) p-8 shadow-2xl">
                <button type="button" onClick={() => onDismiss(campaign)} className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
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

                    <div className="mt-6 flex flex-col w-full grid-cols-2 gap-4">
                        <button type="button" onClick={() => {
                            onAccess(campaign)
                            window.open(`${campaign.url}`)
                        }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                            Acessar campanha
                            <ExternalLink className="size-4" />
                        </button>

                        <button type="button" onClick={() => onDismiss(campaign)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-transparent px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5">
                            Lembrar depois
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

type CampaignActiveContextData = {
    campaignActive: Campaign | null
    handleSetCampaignActive: (CampaignActive: Campaign | null) => void;
    onLoginCompleted: (status: boolean) => void
};

const CampaignActiveContext = createContext<CampaignActiveContextData | undefined>(undefined);

type CampaignActiveProviderProps = {
    children: React.ReactNode;
};

export function CampaignActiveProvider({ children }: CampaignActiveProviderProps) {
    const [campaignActive, setCampaignActive] = useState<Campaign | null>(null);
    const [isLoginCompleted, setIsLoginCompleted] = useState(false)
    const { data, isLoading } = useGetCampaignActive(isLoginCompleted)
    const { mutateAsync: dataSeen } = useSeenCampaign()
    const { mutateAsync: dataDismissed } = useDismissedCampaign()
    const { mutateAsync: dataAcessed  } = useAcessedCampaign()

    useEffect(() => {
        if (data && isLoginCompleted) {
            setCampaignActive(data.campaign);
        }
    }, [data]);

    function handleSetCampaignActive(
        campaign: Campaign | null
    ) {
        setCampaignActive(campaign);
    }

    function handleSetIsLoginCompleted(status: boolean) {
        setIsLoginCompleted(status)
    }

    function handleAccess(campaign: Campaign) {
        dataSeen({campaignId: campaign.id})
        dataAcessed({campaignId: campaign.id})
        setCampaignActive(null);
        setIsLoginCompleted(false)
    }

    function handleDismiss(campaign: Campaign) {
        dataSeen({campaignId: campaign.id})
        dataDismissed({campaignId: campaign.id})
        setCampaignActive(null);
        setIsLoginCompleted(false)
    }

    return (
        <CampaignActiveContext.Provider
            value={{
                campaignActive,
                handleSetCampaignActive,
                onLoginCompleted: handleSetIsLoginCompleted
            }}
        >
            {children}

            {!isLoading && (
                <CampaignNotificationModal
                    campaign={campaignActive}
                    onAccess={handleAccess}
                    onDismiss={handleDismiss}
                />
            )}
        </CampaignActiveContext.Provider>
    );
}

export function useCampaignActive() {
    const context = useContext(CampaignActiveContext);

    if (!context) {
        throw new Error("Erro ao usar Campaign Active");
    }

    return context;
}