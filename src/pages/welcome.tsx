import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderPinwheel, MoveRight } from "lucide-react";

export function Welcome() {
    return (
        <div className="flex flex-col justify-center items-center px-70">
            <div className="px-3 py-1 border border-zinc-200 rounded-lg">
                <p className="text-sm font-medium text-blue-500">Nexus Gateway · Intranet Lusati</p>
            </div>
            <div className="flex flex-col items-center gap-4 mt-6 max-w-2xl text-center">
                <h2 className="text-5xl font-bold">Bem-vindo ao</h2>
                <h2 className="text-5xl font-bold text-blue-500">Nexus Gateway</h2>
                <p className="text-center text-zinc-500 text-sm">
                    Plataforma centralizada de gerenciamento de infraestrutura, serviços internos e mapeamento de rede.
                </p>
            </div>
            <div className="w-full px-10 grid grid-cols-1 lg:grid-cols-2 mt-10 gap-6">
                <div className="w-full flex justify-center items-center">
                    <Card
                        className="
                        w-90
                        rounded-2xl px-0 pt-0 shadow-lg
                        border border-transparent
                        transition-all duration-300
                        transform hover:scale-[1.01]
                        hover:shadow-lg
                    ">
                        <CardHeader className="flex flex-col items-center justify-center gap-2 pt-4 px-4 space-y-1 border-zinc-200">
                            <div className="w-10 h-10 border border-blue-300 rounded-md overflow-hidden flex items-center justify-center bg-blue-50">
                                <LoaderPinwheel className="text-blue-500" />
                            </div>

                            <div className="flex flex-col justify-center items-center gap-2">
                                <CardTitle className="text-base font-semibold leading-tight">
                                    Gateway Central
                                </CardTitle>

                                <p className="text-xs text-muted-foreground text-center">
                                    Acesse e gerencie todos os serviços e sistemas internos da infraestrutura.
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-0 pt-0 px-4 flex flex-col justify-center items-center">
                            <div className="flex gap-8">
                                <div className="flex flex-col justify-center items-center">
                                    <span className="text-blue-500 font-semibold text-[1rem]">6</span>
                                    <p className="text-[.8rem] text-gray-500">Serviços</p>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <span className="text-blue-500 font-semibold text-[1rem]">2</span>
                                    <p className="text-[.8rem] text-gray-500">Sistemas</p>
                                </div>
                            </div>
                            <Button
                                className="
                                cursor-pointer w-full gap-2
                                px-0
                                bg-transparent
                                text-blue-500
                                hover:text-blue-500
                                hover:bg-transparent
                                flex justify-center
                                transition-all duration-300
                            "
                                onClick={() => window.open("/", "_blank")}
                            >
                                Acessar módulo
                                <MoveRight size={16} />
                            </Button>
                        </CardContent>
                    </Card>
                </div>


                <div className="w-full flex justify-center items-center">
                    <Card
                        className="
                    w-90
                        rounded-2xl px-0 pt-0 shadow-lg
                        border border-transparent
                        transition-all duration-300
                        transform hover:scale-[1.01]
                        hover:shadow-lg
                    ">
                        <CardHeader className="flex flex-col items-center justify-center gap-2 pt-4 px-4 space-y-1 border-zinc-200">
                            <div className="w-10 h-10 border border-blue-300 rounded-md overflow-hidden flex items-center justify-center bg-blue-50">
                                <LoaderPinwheel className="text-blue-500" />
                            </div>

                            <div className="flex flex-col justify-center items-center gap-2">
                                <CardTitle className="text-base font-semibold leading-tight">
                                    Gateway Central
                                </CardTitle>

                                <p className="text-xs text-muted-foreground text-center">
                                    Acesse e gerencie todos os serviços e sistemas internos da infraestrutura.
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-0 pt-0 px-4 flex flex-col justify-center items-center">
                            <div className="flex gap-8">
                                <div className="flex flex-col justify-center items-center">
                                    <span className="text-blue-500 font-semibold text-[1rem]">6</span>
                                    <p className="text-[.8rem] text-gray-500">Serviços</p>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <span className="text-blue-500 font-semibold text-[1rem]">2</span>
                                    <p className="text-[.8rem] text-gray-500">Sistemas</p>
                                </div>
                            </div>
                            <Button
                                className="
                                cursor-pointer w-full gap-2
                                px-0
                                bg-transparent
                                text-blue-500
                                hover:text-blue-500
                                hover:bg-transparent
                                flex justify-center
                                transition-all duration-300
                            "
                                onClick={() => window.open("/", "_blank")}
                            >
                                Acessar módulo
                                <MoveRight size={16} />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}