import { BackComponent } from "@/components/back-component";
import { SecurityCard } from "@/components/security-card";
import { Cctv, DoorClosed, Shield } from "lucide-react";

export function SecurityCenterPage() {
    return (
        <>
            <div className="px-10 flex justify-start items-start border-b border-zinc-100 bg-white p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-blue-600 rounded-md overflow-hidden flex items-center justify-center bg-blue-100">
                        <Cctv className="text-blue-600 size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Central de Segurança</h1>
                        <p className="text-gray-600 text-[.8rem]">Monitore e acesse os sistemas de controle físico, câmeras e infraestrutura operacional do escritório.</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 px-16 py-8 space-y-6">
                <div className="flex items-center gap-2 p-5 bg-linear-to-br from-[#001B66] via-[#00185C] to-[#00144D] rounded-lg shadow-sm shadow-blue-900 transition-all duration-300 transform hover:scale-[1.01]">
                    <div className="w-12 h-12 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                        <Shield className="text-gray-100 size-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg text-gray-50 font-semibold">Infraestrutura Física</span>
                        <span className="text-sm text-gray-200">Acesse os sistemas de controle físico do escritório. Clique em qualquer card para abrir o painel de gerenciamento.</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <SecurityCard typeColor="black" title="Sistema de Câmeras" ip="192.168.1.5" description="Visualize em tempo real as câmeras de segurança instaladas no escritório.">
                        <Cctv className="text-blue-500 size-5" />
                    </SecurityCard>
                    <SecurityCard typeColor="blue" title="Sistema de Porta Interna" ip="192.168.1.3" description="Controle de acesso da porta interna e área restrita do escritório.">
                        <DoorClosed className="text-blue-500 size-5" />
                    </SecurityCard>
                    <SecurityCard typeColor="blue" title="Sistema de Porta Externa" ip="192.168.1.2" description="Controle de acesso da porta principal do escritório. Gerencie entradas e saídas.">
                        <DoorClosed className="text-blue-500 size-5" />
                    </SecurityCard>
                </div>
            </div>
        </>
    )
}