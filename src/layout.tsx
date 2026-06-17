import { TooltipProvider } from "@/components/ui/tooltip"
import { CommunicationModal } from "./components/comunication/comunication-popup"
import { useCommunicationPopup } from "./components/comunication/hook-control"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { active, markAsRead, setActive } =
        useCommunicationPopup([
            {
                id: "3",
                title: "Reunião de alinhamento trimestral",
                description:
                    "Reunião para alinhamento estratégico do próximo trimestre, definição de prioridades técnicas e planejamento de evolução da plataforma.",
                type: "MEETING",
                priority: "MEDIUM",
                createdAt: new Date("2026-06-15T14:00:00"),
                read: false
            }
        ]);
    return (
        <TooltipProvider>
            <>
                {children}
                <CommunicationModal
                    open={!!active}
                    communication={active}
                    onClose={() => setActive(null)}
                    onMarkAsRead={markAsRead}
                />
            </>
        </TooltipProvider>
    )
}