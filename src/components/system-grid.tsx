import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SystemsData from "@/data/systems.json"

type System = {
    id: string
    name: string
    description: string
    ip?: string
    port?: number
    domain: string
    logo: string
    type: 'homolog' | 'production'
}

const systems: System[] = SystemsData as System[]

interface SystemGridProps {
    fullDetails?: boolean
    filtering?: string
}

export function SystemGrid({ fullDetails, filtering }: SystemGridProps) {
    const filteredSystems = systems.filter((systems) =>
        filtering
            ? systems.name.toLowerCase().includes(filtering.toLowerCase())
            : true
    );

    return (
        <div className="w-full grid grid-cols-1 px-10 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSystems.map((systems) => (
                <Card
                    key={`${systems.id}-${systems.domain}`}
                    className={`
                        flex-1 cursor-pointer
                        rounded-2xl px-0 pt-0 shadow-lg
                        border-t-4 border-transparent
                        transition-all duration-300
                        transform hover:scale-[1.03]
                        hover:shadow-xl ${systems.type === 'production' ? 'hover:border-green-500' : 'hover:border-amber-500'}
                    `}
                >
                    <CardHeader className="flex flex-row items-center justify-between gap-2 pt-4 px-4 border-zinc-200">

                        <div className="flex flex-row items-center gap-2">
                            <div className="w-10 h-10 border border-zinc-300 rounded-md overflow-hidden flex items-center justify-center bg-white">
                                <img
                                    src={`./${systems.logo}`}
                                    alt={systems.name}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            <div className="flex flex-col">
                                <CardTitle className="text-base font-semibold leading-tight">
                                    {systems.name}
                                </CardTitle>

                                <p className="text-xs text-muted-foreground">
                                    {systems.description}
                                </p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-[.8rem] font-semibold border ${systems.type === 'production' ? 'bg-green-100 text-green-700 border-green-500' : 'border-amber-500 bg-amber-100 text-amber-700'}`}>
                            {systems.type === 'production' ? 'Produção' : 'Homologação'}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-2 mt-0 pt-0 px-4">
                        {fullDetails && (
                            <>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="px-2 py-1 rounded-lg bg-muted border border-zinc-300">
                                        <span className="text-xs text-muted-foreground">IP</span>
                                        <p className="font-mono text-[0.8rem]">
                                            {systems.ip ?? "-"}
                                        </p>
                                    </div>

                                    <div className="px-2 py-1 rounded-lg bg-muted border border-zinc-300">
                                        <span className="text-xs text-muted-foreground">PORTA</span>
                                        <p className="font-mono text-[0.8rem]">
                                            {systems.port ?? "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-2 py-1 rounded-lg bg-muted text-sm border border-zinc-300">
                                    <span className="text-xs text-muted-foreground">
                                        DOMÍNIO
                                    </span>
                                    <p className="font-mono text-[0.8rem] break-all">
                                        {systems.domain}
                                    </p>
                                </div>
                            </>
                        )}

                        <Button
                            className="
                                w-full cursor-pointer gap-2
                                border border-gray-300
                                underline underline-offset-4
                                bg-transparent
                                text-blue-700
                                hover:text-blue-900
                                hover:bg-transparent
                                transition-all duration-300
                            "
                            onClick={() => window.open(systems.domain, "_blank")}
                        >
                            <ExternalLink size={16} />
                            Acessar {systems.name}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}