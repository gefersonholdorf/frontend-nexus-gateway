import { AvailabilityComponent } from "@/components/calendar/availability-component";
import { NextEvents } from "@/components/calendar/next-events-summary";
import { GLPISummaryComponent } from "@/components/glpi-summary-component";
import { SummaryUserJira } from "@/components/jira/summary-user-jira";
import { QuickAccessComponent } from "@/components/quick-access-component";
import { QuickAccessSupportComponent } from "@/components/quick-access-support-component";
import { VPNStatusCard } from "@/components/vpn-status-component";
import { WelcomeCard } from "@/components/welcome-card";
import { CustomTooltip } from "@/tours/tooltip";
import { useState } from "react";
import { Joyride } from 'react-joyride';

const steps = [
    {
        target: "#welcome-card",
        title: "Bem-vindo ao Nexus Gateway",
        content:
            "Esta é sua central de acesso corporativo, mensagem de boas vindas.",
    },
    {
        target: "#vpn-status",
        title: "Status da VPN",
        content:
            "Cconfira a validade do acesso e garanta que sua comunicação com os sistemas da empresa esteja funcionando corretamente.",
    },
    {
        target: "#next-events",
        title: "Próximos Eventos",
        content:
            "Consulte reuniões, alinhamentos e compromissos agendados. Utilize este painel para acompanhar sua agenda e evitar perder eventos importantes.",
    },
    {
        target: "#jira-summary",
        title: "Minhas Tarefas Jira",
        content:
            "Acompanhe o resumo das suas atividades do Jira, visualize o progresso do mês e identifique rapidamente tarefas pendentes, em andamento ou concluídas.",
    },
    {
        target: "#available",
        title: "Disponibilidade da Equipe",
        content:
            "Visualize em tempo real o status dos colaboradores. Ao selecionar um membro da equipe, você pode consultar sua agenda e verificar sua disponibilidade para contato.",
    },
    {
        target: "#comunnication",
        title: "Canais Oficiais",
        content:
            "Aqui você pode consultar os canais oficiais da Lusati.",
    },
    {
        target: "#glpi",
        title: "Próximos Eventos",
        content:
            "Acompanhe suas solicitações no GLPI.",
    },
    {
        target: "#quick-access",
        title: "Acesso Rápido",
        content:
            "Encontre os sistemas mais utilizados em um único local. Utilize estes atalhos para acessar ferramentas corporativas de forma rápida e organizada.",
    },
];

export function WelcomePage() {
    const [runTour, setRunTour] = useState(false);

    function handleInitTour() {
        setRunTour(true)
    }
    return (
        <>
            <Joyride
                run={runTour}
                continuous
                steps={steps}
                tooltipComponent={CustomTooltip}
                scrollToFirstStep
            />
            <div className="flex flex-col p-4 lg:p-10 scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="w-full scroll-mt-28" id="welcome-card">
                            <WelcomeCard onInitTour={handleInitTour} />
                        </div>

                        <div className="w-full grid grid-cols-5 gap-6">
                            <div className="col-span-2 space-y-6">
                                <div id="next-events" className="scroll-mt-28">
                                    <NextEvents />
                                </div>
                                <div id="comunnication" className="scroll-mt-28">
                                    <QuickAccessSupportComponent />
                                </div>
                            </div>
                            <div className="col-span-3 space-y-6">
                                <div id="jira-summary" className="scroll-mt-28">
                                    <SummaryUserJira />
                                </div>
                                <div id="glpi" className="scroll-mt-28">
                                    <GLPISummaryComponent />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div id="vpn-status" className="scroll-mt-28">
                            <VPNStatusCard />
                        </div>
                        <div id="available" className="scroll-mt-28">
                            <AvailabilityComponent />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                    <div id="quick-access" className="scroll-mt-28">
                        <QuickAccessComponent />
                    </div>
                </div>
            </div>
        </>
    )
}