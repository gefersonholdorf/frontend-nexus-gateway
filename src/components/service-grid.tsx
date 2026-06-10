import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import servicesData from "@/data/services.json"

type Service = {
    id: string
    name: string
    description: string
    ip?: string
    port?: number
    domain: string
    logo: string
}

const services: Service[] = servicesData as Service[]

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
                        flex-1
                        rounded-2xl px-0 pt-0 shadow-lg
                        border border-transparent
                        hover:border-blue-900/60
                        transition-all duration-300
                        transform hover:scale-[1.03]
                        hover:shadow-xl
                    "
                >
                    <CardHeader className="flex items-start gap-2 pt-4 px-4">

                        <div className="min-w-10 h-10 border border-zinc-300 rounded-md overflow-hidden flex items-center justify-center bg-background">
                            <img
                                src={`./logos/${service.logo}`}
                                alt={service.name}
                                className="max-w-full max-h-full object-contain p-1"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                            <CardTitle className="text-base font-semibold truncate block w-full">
                                {service.name}
                            </CardTitle>

                            <p className="text-xs truncate block text-muted-foreground">
                                {service.description}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-2 mt-0 pt-0 px-4">
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
                                bg-transparent border border-blue-900/60
                                hover:text-blue-900
                                text-blue-700 hover:bg-transparent
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