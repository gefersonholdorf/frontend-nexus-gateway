import { ModuleCard } from "@/components/module-card";
import { SystemStatusCard } from "@/components/system-status-card";
import { WeatherCard } from "@/components/weather-card";
import { WelcomeCard } from "@/components/welcome-card";
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Calendar, Cctv, LayoutDashboard, Network, Package, Server, Share2, Users } from "lucide-react";
import { InfoCard } from "@/components/info-card";

export function WelcomePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 p-10 h-full">
            <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <WelcomeCard />
                    </div>

                    <div className="lg:col-span-1">
                        <WeatherCard />
                    </div>
                </div>
                <div className="lg:col-span-3 bg-white py-2 rounded-sm">
                    <div className="grid grid-cols-6 gap-6 mb-4">
                        <InfoCard title="Serviços" quantity="18">
                            <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                                <Network className="text-white size-4" />
                            </div>
                        </InfoCard>
                        <InfoCard title="Sistemas" quantity="4">
                            <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                                <Network className="text-white size-4" />
                            </div>
                        </InfoCard>
                        <InfoCard title="Servidores" quantity="3">
                            <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                                <Server className="text-white size-4" />
                            </div>
                        </InfoCard>
                        <InfoCard title="IPs Moni..." quantity="18">
                            <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                                <Network className="text-white size-4" />
                            </div>
                        </InfoCard>
                        <InfoCard title="Usuários" quantity="3">
                            <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                                <Users className="text-white size-4" />
                            </div>
                        </InfoCard>
                        <InfoCard title="Módulos" quantity="5">
                            <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                                <Package className="text-white size-4" />
                            </div>
                        </InfoCard>
                    </div>
                    <span className="text-lg font-bold text-gray-700">Acesse os Módulos</span>
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true
                        }}
                        plugins={[
                            Autoplay({
                                delay: 5000,
                            }),
                        ]}
                        className="w-full relative px-6"
                    >
                        <CarouselContent className="py-4 pl-1 mr-2">
                            <CarouselItem className="basis-1/4">
                                <ModuleCard page="services" title="Gateway Central" description="Acesse todos os serviços e sistemas internos da infraestrutura.">
                                    <LayoutDashboard className="text-blue-500" />
                                </ModuleCard>
                            </CarouselItem>
                            <CarouselItem className="basis-1/4">
                                <ModuleCard page="ipmap" title="IP Map" description="Visualize o mapeamento completo de IPs da rede interna, e encontre IPs livres.">
                                    <Network className="text-blue-500" />
                                </ModuleCard>
                            </CarouselItem>
                            <CarouselItem className="basis-1/4">
                                <ModuleCard redirection="https://lusati.sharepoint.com/_layouts/15/sharepoint.aspx" title="SharePoint" description="Acesse o repositório central de documentos e arquivos da empresa.">
                                    <Share2 className="text-blue-500" />
                                </ModuleCard>
                            </CarouselItem>
                            <CarouselItem className="basis-1/4">
                                <ModuleCard page="security-center" title="Central de Segurança" description="Monitore e acesse os sistemas de controle físico, câmeras e infraestrutura operacional do escritório.">
                                    <Cctv className="text-blue-500" />
                                </ModuleCard>
                            </CarouselItem>
                            <CarouselItem className="basis-1/4">
                                <ModuleCard page="security-center" title="Calendário" description="Monitore e acesse os sistemas de controle físico, câmeras e infraestrutura operacional do escritório.">
                                    <Calendar className="text-blue-500" />
                                </ModuleCard>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                    </Carousel>
                </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <SystemStatusCard serverName="SERVER - BRA - INFRA" serverId="10653" />
                <SystemStatusCard serverName="SERVER - BRA - APP" serverId="10654" />
                <SystemStatusCard serverName="SERVER - BRA - HOM" serverId="10654" />
            </div>
        </div>
    )
}