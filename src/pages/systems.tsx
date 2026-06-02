import { BackComponent } from "@/components/back-component";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppWindow, Expand, Minimize } from "lucide-react";
import { useState } from "react";
import { SystemGrid } from "@/components/system-grid";

export function SystemsPage() {
    const [fullDetails, setFullDetails] = useState(false)
    const [filtering, setFiltering] = useState("")

    function toggleDetails() {
        console.log("Toggle details")
        setFullDetails((prev) => !prev)
    }

    function handleFilterChange(value: string) {
        setFiltering(value)
    }

    return (
        <div className="bg-[url('5570869.jpg')] bg-cover bg-center flex flex-col min-h-screen justify-between">
            <div className="px-10 flex justify-between items-center border-b border-zinc-100 bg-white p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-blue-600 rounded-md overflow-hidden flex items-center justify-center bg-blue-100">
                        <AppWindow className="text-blue-600 size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Sistemas</h1>
                        <p className="text-gray-600 text-[.8rem]">Visualize e acesse todos os sistemas da Lusati Tecnologia.</p>
                    </div>
                </div>
                <Tooltip>
                    <TooltipTrigger>
                        {fullDetails ? (
                            <Minimize onClick={toggleDetails} className="size-6 hover:text-blue-500 cursor-pointer" />
                        ) : (
                            <Expand onClick={toggleDetails} className="size-5 hover:text-blue-500 cursor-pointer" />
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        {fullDetails ? (
                            <p>Minimizar</p>
                        ) : (
                            <p>Expandir</p>
                        )}
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex-1 py-4">
                <SystemGrid fullDetails={fullDetails} filtering={filtering} />
            </div>
        </div>
    )
}