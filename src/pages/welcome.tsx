import { BackupOverviewComponent } from "@/components/backup-overview";
import { IncidentOverviewComponent } from "@/components/incident-overview";
import { InfoCard } from "@/components/info-card";
import { ModuleCard } from "@/components/module-card";
import { SystemStatusCard } from "@/components/system-status-card";
import { WeatherCard } from "@/components/weather-card";
import { WelcomeCard } from "@/components/welcome-card";
import { AppWindow, Calendar, Cctv, LayoutDashboard, Network, Server, Share2 } from "lucide-react";

export function WelcomePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 p-10 h-full">
            <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <WelcomeCard />
                    </div>

                    <div className="lg:col-span-1">
                        <WeatherCard />
                    </div>
                </div>
                <div className="lg:col-span-3 bg-white rounded-sm flex flex-col gap-2">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                                <InfoCard title="Serviços" quantity="18">
                                    <div className="w-10 h-10 border border-blue-900 rounded-md overflow-hidden flex items-center justify-center bg-blue-900">
                                        <Network className="text-white size-4" />
                                    </div>
                                </InfoCard>
                                <InfoCard title="Sistemas" quantity="4">
                                    <div className="w-10 h-10 border border-blue-900 rounded-md overflow-hidden flex items-center justify-center bg-blue-900">
                                        <Network className="text-white size-4" />
                                    </div>
                                </InfoCard>
                                <InfoCard title="Servidores" quantity="3">
                                    <div className="w-10 h-10 border border-blue-900 rounded-md overflow-hidden flex items-center justify-center bg-blue-900">
                                        <Server className="text-white size-4" />
                                    </div>
                                </InfoCard>
                                <InfoCard title="IPs Moni..." quantity="18">
                                    <div className="w-10 h-10 border border-blue-900 rounded-md overflow-hidden flex items-center justify-center bg-blue-900">
                                        <Network className="text-white size-4" />
                                    </div>
                                </InfoCard>

                            </div>
                            <span className="text-lg font-bold text-gray-700">Acesse os Módulos</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-2 gap-6">
                                <ModuleCard page="services" title="Serviços" description="Visualize e acesse todos os serviços internos da infraestrutura.">
                                    <LayoutDashboard className="text-blue-500" />
                                </ModuleCard>
                                <ModuleCard page="systems" title="Sistemas" description="Visualize e acesse todos os sistemas da Lusati Tecnologia">
                                    <AppWindow className="text-blue-500" />
                                </ModuleCard>
                                <ModuleCard page="ipmap" title="IP Map" description="Visualize o mapeamento completo de IPs da rede interna, e encontre IPs livres.">
                                    <Network className="text-blue-500" />
                                </ModuleCard>
                                <ModuleCard redirection="https://lusati.sharepoint.com/_layouts/15/sharepoint.aspx" title="SharePoint" description="Acesse o repositório central de documentos e arquivos da empresa.">
                                    <Share2 className="text-blue-500" />
                                </ModuleCard>
                                <ModuleCard page="security-center" title="Central de Segurança" description="Monitore e acesse os sistemas de controle físico, câmeras e infraestrutura operacional do escritório.">
                                    <Cctv className="text-blue-500" />
                                </ModuleCard>
                                <ModuleCard isBlock page="security-center" title="Calendário" description="Monitore e acesse os sistemas de controle físico, câmeras e infraestrutura operacional do escritório.">
                                    <Calendar className="text-blue-500" />
                                </ModuleCard>
                            </div>
                        </div>
                        <BackupOverviewComponent />
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <SystemStatusCard serverName="SERVER - BRA - INFRA" serverId="10653" />
                <SystemStatusCard serverName="SERVER - BRA - APP" serverId="10654" />
                <SystemStatusCard serverName="SERVER - BRA - HOM" serverId="10656" />
                <IncidentOverviewComponent />
            </div>
        </div>
    )
}