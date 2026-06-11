import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Server, ShieldCheck } from "lucide-react"

export function UsersPrivilegesServers() {
    return (
        <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1 px-14">
                    <AccordionTrigger className="h-fit w-full items-center rounded-none rounded-t-lg p-4 bg-(image:--background-gradient) border-2
                            border-border transition-all duration-300 transform shadow-lg">
                        <div className="flex gap-2 items-center">
                            <Avatar className="w-10">
                                <AvatarImage className="h-10 w-10" src="https://avatars.githubusercontent.com/u/68699314?v=4" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-[1rem] text-primary-text font-semibold">Geferson Holdorf</span>
                                <span className="text-[.8rem] text-muted-foreground">gholdorf</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="h-fit w-full mb-4 p-4 justify-start rounded-b-lg shadow-lg bg-(image:--background-gradient) border-2 border-border">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 items-start">
                            <div className="flex gap-2 items-center">
                                <Server className="size-4" />
                                <span>Servidores & Privilégios</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <ShieldCheck className="size-4" />
                                <span>Histórico de Privilégios</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}