import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
                        group
                        flex-1 justify-center bg-(image:--background-gradient)
                        rounded-2xl px-0 pt-0 pb-4 shadow-lg
                        border border-transparent
                        hover:border:border
                        transition-all duration-300
                        transform hover:scale-[1.03]
                        hover:shadow-xl cursor-pointer
                    "
                    onClick={() => window.open(service.domain, "_blank")}
                >
                    <CardHeader className="flex items-start justify-center gap-2 pt-4 px-4">

                        <div
                            className="
                                                h-12
                                                w-12
                                                rounded-2xl
                                                border
                                                bg-linear-to-br
                                                from-white
                                                to-slate-100
                                                shadow-md
                                                flex
                                                items-center
                                                justify-center
                                                overflow-hidden
                                            "
                        >
                            <img
                                src={`./logos/${service.logo}`}
                                alt={service.name}
                                className="
                                                    w-8
                                                    h-8
                                                    object-contain
                                                    transition-transform
                                                    duration-500
                                                    group-hover:scale-110
                                                "
                            />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                            <CardTitle className="text-base font-bold truncate block w-full group-hover:text-primary">
                                {service.name}
                            </CardTitle>

                            <p className="text-xs truncate block text-muted-foreground">
                                {service.description}
                            </p>
                        </div>
                    </CardHeader>

                    {fullDetails && (
                        <CardContent className="space-y-2 p-4 mt-0 pt-0">
                            <>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="px-2 py-1 rounded-lg bg-muted border border-border">
                                        <span className="text-xs text-muted-foreground">IP</span>
                                        <p className="font-mono text-muted-foreground text-[0.8rem]">
                                            {service.ip ?? "-"}
                                        </p>
                                    </div>

                                    <div className="px-2 py-1 rounded-lg bg-muted border border-border">
                                        <span className="text-xs text-muted-foreground">PORTA</span>
                                        <p className="font-mono text-[0.8rem] text-muted-foreground">
                                            {service.port ?? "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-2 py-1 rounded-lg bg-muted text-sm border border-border">
                                    <span className="text-xs text-muted-foreground">
                                        DOMÍNIO
                                    </span>
                                    <p className="font-mono text-muted-foreground text-[0.8rem] break-all">
                                        {service.domain}
                                    </p>
                                </div>
                            </>

                            {/* <Button
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
                            </Button> */}
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
}