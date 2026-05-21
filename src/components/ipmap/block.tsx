import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface BlockProps {
    used: boolean
    number: string
    service: string | null
}

export function Block({ used, service, number }: BlockProps) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                    className={`
                relative border p-2 rounded-lg flex flex-col items-center justify-center disabled h-14
                ${used ? 'bg-amber-50 border-amber-300 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer' : 'bg-emerald-50 border-emerald-300'}`}
                >
                    {used && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></div>}
                    <span className={`text-[.8rem] font-bold italic ${used ? 'text-amber-600' : 'text-emerald-600'}`}>.{number.split('.').pop()}</span>
                    {service && <span className="text-[.7rem] font-normal italic text-amber-900 text-red-amber truncate block max-w-full">{service}</span>}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {used ? (
                    <div className="flex flex-col">
                        <p className="italic">{number}</p>
                        <p className="italic text-zinc-300 text-[.7rem]">{service}</p>
                    </div>
                ) : (
                    <p className="italic">{number} - Livre</p>
                )}
            </TooltipContent>
        </Tooltip>
    )
}