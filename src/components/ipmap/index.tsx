import { Skeleton } from "../ui/skeleton";
import { Block } from "./block";

interface IpMapComponentProps {
    subnet: string
    data: {
        ip: string,
        used: boolean,
        service: string | null
        state: string | null
    }[],
    isLoading: boolean
}

export function IpMapComponent({ subnet, data, isLoading }: IpMapComponentProps) {
    return (
        <div className="bg-white mx-10 mb-8 p-4 rounded-xl border border-zinc-300 shadow-lg space-y-4 ">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex gap-2 items-center">
                    <div className="flex w-fit py-1 px-2 border border-zinc-300 bg-white rounded-sm shadow-sm">
                        {
                            isLoading ? (
                                <Skeleton className="h-5 w-20" />
                            ) : (
                                <p className="text-[.8rem] text-gray-500 italic">{subnet}</p>
                            )
                        }

                    </div>
                    <p className="text-[.8rem] text-gray-500 italic">254 endereços visíveis</p>
                </div>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-15 gap-2">
                {
                    isLoading && (
                        <>
                            {Array.from({ length: 254 }).map((_, index) => (
                                <Skeleton key={index} className="h-20 w-full" />
                            ))}
                        </>
                    )
                }
                {data.map((item) => (
                    <Block key={item.ip} used={item.used} number={item.ip} service={item.service ?? null} />
                ))}
            </div>
        </div >
    )
}