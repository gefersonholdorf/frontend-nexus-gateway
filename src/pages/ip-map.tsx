import { IpMapComponent } from "@/components/ipmap";
import { Porcentage } from "@/components/ipmap/porcentage";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function IpMapPage() {
    return (
        <div className="px-10 space-y-4">
            <div className="w-full grid grid-cols-2 gap-4 justify-between">
                <div className="flex gap-2 items-start border bg-white p-4 rounded-xl border-zinc-300 shadow-sm w-full transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex flex-col justify-between gap-2">
                        <div className="flex gap-2">
                            <Select defaultValue="light">
                                <SelectTrigger className="w-45">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="light">Servidor BRA APP</SelectItem>
                                        <SelectItem value="dark">Servidor BRA INFRA</SelectItem>
                                        <SelectItem value="system">Servidor EUA PROD</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="light">
                                <SelectTrigger className="w-45">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="light">docker_f_net</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                <span className="text-[.7rem] text-gray-500">Em uso</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                                <span className="text-[.7rem] text-gray-500">Livre</span>
                            </div>
                        </div>
                    </div>

                </div>
                <Porcentage />
            </div>
            <IpMapComponent />
        </div >
    )
}