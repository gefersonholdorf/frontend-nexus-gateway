import { Block } from "./block";

export function IpMapComponent() {
    return (
        <div className="bg-white p-4 rounded-xl border border-zinc-300 shadow-lg space-y-4">
            <div className="flex justify-between gap-4">
                <div className="flex gap-2 items-center">
                    <div className="flex w-fit py-1 px-2 border border-zinc-300 bg-white rounded-sm shadow-sm">
                        <p className="text-[.8rem] text-gray-500 italic">10.188.15.0/24</p>
                    </div>
                    <p className="text-[.8rem] text-gray-500 italic">254 endereços visíveis</p>
                </div>
                <div className="flex gap-2 items-start justify-start">
                    <div className="flex px-2 py-1 border border-blue-300 rounded-lg bg-blue-500">
                        <p className="text-[.7rem] text-white font-semibold">Todos</p>
                    </div>
                    <div className="flex px-2 py-1 border border-zinc-300 rounded-lg">
                        <p className="text-[.7rem] text-zinc-500 font-semibold">Usados</p>
                    </div>
                    <div className="flex px-2 py-1 border border-zinc-300 rounded-lg">
                        <p className="text-[.7rem] text-zinc-500 font-semibold">Livres</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-15 gap-2">

                <Block key={0} used={true} number={'3'} service="nginx-proxy-manager" />
                {Array.from({ length: 254 }).map((_, index) => (
                    <Block key={index} used={Math.random() < 0.5} number={index.toString()} />
                ))}
            </div>
        </div>
    )
}