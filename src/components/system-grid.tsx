import {
    ArrowRight,
    ExternalLink,
    Globe,
    Network,
    Server
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import SystemsData from "@/data/systems.json";

type System = {
    id: string;
    name: string;
    description: string;
    ip?: string;
    port?: number;
    domain: string;
    logo: string;
    type: "homolog" | "production";
};

const systems: System[] = SystemsData as System[];

interface SystemGridProps {
    fullDetails?: boolean;
    filtering?: string;
    typeFiltering?: 'todos' | 'production' | 'homolog'
}

export function SystemGrid({
    fullDetails = false,
    filtering = "",
    typeFiltering = 'todos'
}: SystemGridProps) {
    const filteredSystems = systems
        .filter((system) => {
            if (typeFiltering === 'todos') return system
            return system.type === typeFiltering
        })
        .filter((system) =>
            system.name.toLowerCase().includes(filtering.toLowerCase())
        );

    return (
        <div className="w-full px-6 xl:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredSystems.map((system) => {
                    const isProd = system.type === "production";

                    return (
                        <Card
                            key={`${system.id}-${system.domain}`}
                            onClick={() => window.open(`${system.domain}`, "_blank")}
                            className={`
                                group
                                relative
                                gap-1
                                overflow-hidden
                                rounded-3xl
                                border-t-4 border-transparent
                                bg-linear-to-b
                                from-background
                                to-muted/20
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                                hover:border-primary/30
                                p-0
                                py-2
                                cursor-pointer
                                ${isProd ? 'hover:border-emerald-500' : 'hover:border-amber-500'}
                            `}
                        >
                            <CardHeader className="relative z-10 border-b p-4">
                                <div className="flex items-start justify-between gap-3 w-full min-w-0">
                                    <div className="flex gap-4 flex-1 min-w-0">
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
                                                src={`./${system.logo}`}
                                                alt={system.name}
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

                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <CardTitle
                                                className="
                                                    font-bold
                                                    transition-colors
                                                    duration-300
                                                    group-hover:text-primary
                                                    truncate
                                                    block
                                                    w-full
                                                "
                                            >
                                                {system.name}
                                            </CardTitle>

                                            <p className="text-[.8rem] text-muted-foreground mt-1 truncate block w-full">
                                                {system.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <div className="pt-4 px-4">
                                {fullDetails && (
                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            bg-muted/40 p-4 mb-4 gap-4
                                        "
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Server size={14} />
                                                    <span className="text-xs text-muted-foreground">
                                                        IP
                                                    </span>
                                                </div>

                                                <p className="font-mono text-[.8rem] text-primary-text font-medium">
                                                    {system.ip ?? "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Network size={14} />
                                                    <span className="text-xs text-muted-foreground">
                                                        Porta
                                                    </span>
                                                </div>

                                                <p className="font-mono text-[.8rem] text-primary-text font-medium">
                                                    {system.port ?? "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Globe size={14} />
                                                <span className="text-xs text-muted-foreground">
                                                    Domínio
                                                </span>
                                            </div>

                                            <p className="font-mono text-[.8rem] text-primary-text break-all">
                                                {system.domain}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    onClick={() => window.open(system.domain, "_blank")}
                                    className="
                                        w-full
                                        h-11
                                        px-3 py-0
                                        rounded-xl
                                        justify-between
                                        border
                                        transition-all cursor-pointer hover:bg-transparent
                                    "
                                >
                                    <div className="flex items-center gap-2 text-primary font-medium">
                                        <ExternalLink size={15} />
                                        Acessar Sistema
                                    </div>

                                    <ArrowRight
                                        size={15}
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}