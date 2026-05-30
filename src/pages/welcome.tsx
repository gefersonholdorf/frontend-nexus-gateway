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
import { Cctv, LayoutDashboard, Network, Share2 } from "lucide-react";

export function WelcomePage() {
    return (
        <div className="flex flex-1 h-full gap-6 flex-col p-10 lg:px-10 bg-[url('5570869.jpg')] bg-cover bg-center">

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <WelcomeCard />
                    <div className="mt-4 bg-white py-2 px-2 rounded-sm">
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
                            className="w-full relative"
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
                            </CarouselContent>
                            <CarouselPrevious className="-left-8" />
                            <CarouselNext className="-right-8" />
                        </Carousel>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <WeatherCard />
                    <div className="mt-4 bg-white py-2 px-2 rounded-sm">
                        <span className="text-lg font-bold text-gray-700">Servidores</span>
                        <div className="flex flex-col gap-2 pt-2">
                            <SystemStatusCard serverName="SERVER - BRA - APP" />
                            <SystemStatusCard serverName="SERVER - BRA - HOM" />
                            <SystemStatusCard serverName="SERVER - BRA - INFRA" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}