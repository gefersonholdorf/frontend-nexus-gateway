import { BackComponent } from "@/components/back-component";
import { IpMapComponent } from "@/components/ipmap";
import { Porcentage } from "@/components/ipmap/porcentage";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import serversData from "@/data/servers.json";
import { useQuery } from "@tanstack/react-query";
import { Network } from "lucide-react";
import { useState } from "react";

interface Server {
    id: number
    serverName: string
    serverId: number
    networkId: string
}

interface IpsResponse {
    network: string,
    fullMap: {
        ip: string,
        used: boolean,
        service: string | null
        state: string | null
    }[]
}

export function IpMapPage() {

    const [selectedServer, setSelectedServer] = useState<Server>(serversData[0]);

    const query = useQuery(
        {
            queryKey: ['ips', selectedServer],
            queryFn: async () => {
                const response = await fetch(
                    `http://10.188.15.99:3336/ips/server/${selectedServer.serverId}/network/${selectedServer.networkId}`
                );

                if (!response.ok) {
                    throw new Error('Erro ao buscar IPs');
                }

                const result: IpsResponse = await response.json()

                return result
            }
        }
    )

    const quantityUsed = query.data?.fullMap.filter((item) => item.used).length || 0
    const quantityTotal = query.data?.fullMap.length || 0
    const percentageUsed = quantityTotal > 0 ? (quantityUsed / quantityTotal) * 100 : 0

    return (
        <div className="space-y-4">
            <div className="px-10 flex justify-between items-center border-b border-zinc-100 bg-white p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-blue-600 rounded-md overflow-hidden flex items-center justify-center bg-blue-100">
                        <Network className="text-blue-600 size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">IP Map</h1>
                        <p className="text-gray-600 text-[.8rem]">Visualize o mapeamento completo de IPs da rede interna, e encontre IPs livres.</p>
                    </div>
                </div>
            </div>
            <div className="w-full px-10 grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between">
                <div className="flex gap-2 items-start border bg-white p-4 rounded-xl border-zinc-300 shadow-sm w-full transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex flex-col justify-between gap-2">
                        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2">
                            <Select
                                value={selectedServer.serverId.toString()}
                                onValueChange={(value) => {
                                    const server = serversData.find((s) => s.serverId.toString() === value);
                                    if (server) {
                                        setSelectedServer(server);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="9">SERVIDOR BRA APP</SelectItem>
                                        <SelectItem value="2">SERVIDOR BRA INFRA</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex gap-2 items-center">
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <span className="text-[.8rem] text-gray-500">Em uso</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                                <span className="text-[.8rem] text-gray-500">Livre</span>
                            </div>
                        </div>
                    </div>

                </div>
                {query.isLoading ? (
                    <Skeleton className="h-30 w-full rounded-xl border border-zinc-300 shadow-sm" />
                ) : (<Porcentage percentage={Number(percentageUsed.toFixed(2))} quantityUsed={quantityUsed} quantityTotal={quantityTotal} />)}
            </div>

            <IpMapComponent subnet={query.data?.network || ""} data={query.data?.fullMap || []} isLoading={query.isLoading} />
        </div >
    )
}