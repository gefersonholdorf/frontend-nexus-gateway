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
]

export function ServiceGrid() {
    return (
        <div className="grid grid-cols-1 px-10 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
                <Card key={service.id} className="rounded-2xl shadow-lg border border-transparent hover:border-blue-500/60 transition-all duration-300 transform hover:scale-102 hover:shadow-lg hover:shadow-blue-200/60">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {service.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {service.description}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded-lg bg-muted">
                                <span className="text-xs text-muted-foreground">IP</span>
                                <p>{service.ip ?? "-"}</p>
                            </div>

                            <div className="p-2 rounded-lg bg-muted">
                                <span className="text-xs text-muted-foreground">PORTA</span>
                                <p>{service.port ?? "-"}</p>
                            </div>
                        </div>

                        <div className="p-2 rounded-lg bg-muted text-sm">
                            <span className="text-xs text-muted-foreground">DOMÍNIO</span>
                            <p className="break-all">{service.domain}</p>
                        </div>

                        <Button
                            className="w-full gap-2"
                            onClick={() => window.open(service.domain, "_blank")}
                        >
                            <ExternalLink size={16} />
                            Acessar
                        </Button>
                    </CardContent>
                </Card >
            ))
            }
        </div >
    )
}