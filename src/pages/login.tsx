import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Network, Server, Shield } from "lucide-react";

export function LoginPage() {
    return (
        <div className="h-screen w-screen p-x grid grid-cols-1 lg:grid-cols-2">
            <div
                className="hidden bg-linear-to-br from-[#367BF4] via-[#1D5FE0] to-[#0D47C9]
                        lg:flex flex-col justify-between px-16 py-16"
            >
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                        <Network className="text-white size-4" />
                    </div>
                    <span className="text-lg text-white font-semibold">Nexus Gateway</span>
                </div>
                <div className="flex flex-col gap-4 max-w-3/5">
                    <h2 className="font-bold text-4xl text-gray-50">Sua central de Intranet</h2>
                    <p className="text-gray-100 text-sm font-normal">Gerencie serviços, monitore IPs, acesse documentos e mantenha toda a equipe conectada em um só lugar.</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                            <Server className="text-gray-200 size-4" />
                        </div>
                        <span className="text-sm text-gray-200 font-normal">Monitoramento de Serviços</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                            <Network className="text-gray-200 size-4" />
                        </div>
                        <span className="text-sm text-gray-200 font-normal">Mapeamento de rede em tempo real</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                            <Shield className="text-gray-200 size-4" />
                        </div>
                        <span className="text-sm text-gray-200 font-normal">Acesso seguro com autenticação</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-[.8rem] font-normal">
                        © 2026 Geferson Holdorf — Nexus Gateway
                    </span>
                    <span className="text-gray-300 text-[.8rem] font-semibold">
                        v1.4.0
                    </span>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-start px-16">
                <h3 className="text-3xl font-bold text-gray-900">Entrar</h3>
                <p className="text-[.9rem] font-normal text-gray-600 mt-2">Acesse sua conta para continuar</p>
                <div className="mt-6 mb-6 space-y-2 w-full">
                    <div className="w-full">
                        <span className="text-[.8rem] text-gray-600">E-mail</span>
                        <Input
                            className="w-full p-5"
                            placeholder="Informe seu e-mail..."
                        />
                    </div>
                    <div className="w-full">
                        <span className="text-[.8rem] text-gray-600">Senha</span>
                        <Input
                            type="password"
                            className="w-full p-5"
                            placeholder="Informe sua senha..."
                        />
                    </div>
                </div>
                <Button className="w-full shadow-sm shadow-blue-200 p-5 font-bold cursor-pointer bg-linear-to-br from-[#367BF4] via-[#1D5FE0] to-[#0D47C9] hover:bg-blue-800 text-white">
                    <LogIn />
                    Entrar na plataforma
                </Button>
                <div className="w-full text-center pt-8">
                    <span className="text-[.8rem] font-normal text-gray-600">
                        Problemas com acesso? <span className="text-blue-600 cursor-pointer hover:underline">Contate o suporte</span>
                    </span>
                </div>
            </div>
        </div>
    )
}