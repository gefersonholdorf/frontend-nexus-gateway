import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Service = {
    id: string
    name: string
    description: string
    ip?: string
    port?: number
    domain: string
}

const services: Service[] = [
    {
        id: "grafana",
        name: "Grafana",
        description: "Monitoramento e dashboards",
        ip: "10.0.0.15",
        port: 3000,
        domain: "http://grafana.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
    {
        id: "glpi",
        name: "GLPI",
        description: "Gestão de chamados TI",
        ip: "10.0.0.20",
        port: 80,
        domain: "http://glpi.nexus.local",
    },
]

interface ServiceGridProps {
    fullDetails?: boolean
    filtering?: string
}

export function ServiceGrid({ fullDetails, filtering }: ServiceGridProps) {
    const filteredServices = services.filter((service) =>
        filtering
            ? service.name.toLowerCase().includes(filtering.toLowerCase())
            : true
    );

    return (
        <div className="w-full grid grid-cols-1 px-10 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
                <Card
                    key={`${service.id}-${service.domain}`}
                    className="
                        rounded-2xl px-0 py-4 shadow-lg
                        border border-transparent
                        hover:border-blue-500/60
                        transition-all duration-300
                        transform hover:scale-[1.03]
                        hover:shadow-xl hover:shadow-blue-200/40
                    "
                >
                    <CardHeader className="flex flex-row items-center gap-2 py-0 px-4 border-b border-zinc-200">

                        <div className="w-12 h-12 border border-zinc-300 rounded-md overflow-hidden flex items-center justify-center bg-white">
                            <img
                                src="./logo-grafana.png"
                                alt={service.name}
                                className="w-10 h-10 object-contain"
                            />
                        </div>

                        <div className="flex flex-col">
                            <CardTitle className="text-base font-semibold leading-tight">
                                {service.name}
                            </CardTitle>

                            <p className="text-xs text-muted-foreground">
                                {service.description}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-2 px-4">
                        {fullDetails && (
                            <>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="px-2 py-1 rounded-lg bg-muted border border-zinc-300">
                                        <span className="text-xs text-muted-foreground">IP</span>
                                        <p className="font-mono text-[0.8rem]">
                                            {service.ip ?? "-"}
                                        </p>
                                    </div>

                                    <div className="px-2 py-1 rounded-lg bg-muted border border-zinc-300">
                                        <span className="text-xs text-muted-foreground">PORTA</span>
                                        <p className="font-mono text-[0.8rem]">
                                            {service.port ?? "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-2 py-1 rounded-lg bg-muted text-sm border border-zinc-300">
                                    <span className="text-xs text-muted-foreground">
                                        DOMÍNIO
                                    </span>
                                    <p className="font-mono text-[0.8rem] break-all">
                                        {service.domain}
                                    </p>
                                </div>
                            </>
                        )}

                        <Button
                            className="
                                cursor-pointer w-full gap-2
                                bg-transparent border border-blue-500/60
                                hover:bg-blue-500 hover:text-white
                                text-blue-600
                                transition-all duration-300
                            "
                            onClick={() => window.open(service.domain, "_blank")}
                        >
                            <ExternalLink size={16} />
                            Acessar
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}