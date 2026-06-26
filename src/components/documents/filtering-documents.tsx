import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { X } from "lucide-react";

export function FilteringDocuments() {
    return (
        <Card className="h-fit rounded-sm p-4 space-y-1 border-none border-transparent shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-sm outline-none bg-(image:--background-gradient)">
            <div className="flex flex-col gap-2">
                <span className=" mt-0 text-[.8rem]">Filtrar por:</span>
                <div className="w-full grid grid-cols-1 lg:grid-cols-7 gap-4">
                    <div className="col-span-3">
                        <Input placeholder="Buscar por código ou título..." />
                    </div>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="pol">Política</SelectItem>
                                <SelectItem value="proc">Procedimento</SelectItem>
                                <SelectItem value="man">Manual</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="light">Vigente</SelectItem>
                                <SelectItem value="dark">Em Andamento</SelectItem>
                                <SelectItem value="system">Em Revisão</SelectItem>
                                <SelectItem value="system">Pendente</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Departamento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="light">RH</SelectItem>
                                <SelectItem value="dark">Infra</SelectItem>
                                <SelectItem value="system">Suporte</SelectItem>
                                <SelectItem value="system">Devenvolvedor</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="px-4 py-2 rounded-sm hover:bg-card text-muted-foreground hover:text-red-500 border border-transparent hover:border-border text-[.8rem] flex items-center justify-center cursor-pointer gap-2">
                        <X className="size-4" />
                        <span>Limpar Filtros</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}