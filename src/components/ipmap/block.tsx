import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface BlockProps {
    used: boolean
    number: string
    service?: string
}

export function Block({ used, service, number }: BlockProps) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                    className={`
                relative border p-2 rounded-lg flex flex-col items-center justify-center disabled h-14
                ${used ? 'bg-amber-50 border-amber-300 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer' : 'bg-zinc-100 border-zinc-300'}`}
                >
                    {used && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></div>}
                    <span className={`text-[.8rem] font-bold italic ${used ? 'text-amber-600' : 'text-zinc-600'}`}>.{number}</span>
                    {service && <span className="text-[.6rem] font-normal text-red-amber truncate block max-w-full">{service}</span>}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {used ? (
                    <div className="flex flex-col">
                        <p className="italic">10.188.15.4</p>
                        <p className="italic text-zinc-400 text-[0.6rem]">nginx . :8080</p>
                    </div>
                ) : (
                    <p className="italic">10.188.15.4 - Livre</p>
                )}
            </TooltipContent>
        </Tooltip>
    )
}