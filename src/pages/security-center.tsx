import { BackComponent } from "@/components/back-component";
import { Cctv } from "lucide-react";

export function SecurityCenterPage() {
    return (
        <>
            <div className="px-10 flex justify-between items-center border-b border-zinc-100 bg-white p-4 rounded-lg">
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
            <div className="flex-1 py-4">
                {/* <ServiceGrid fullDetails={fullDetails} filtering={filtering} /> */}
            </div>
        </>
    )
}