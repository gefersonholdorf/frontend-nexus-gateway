import { Clock, Network } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";

export function WelcomeCard() {
    const [tempo, setTempo] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTempo(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getSaudacao = () => {
        const hora = tempo.getHours();

        if (hora >= 5 && hora < 12) {
            return "Bom dia";
        }

        if (hora >= 12 && hora < 18) {
            return "Boa tarde";
        }

        return "Boa noite";
    };

    return (
        <Card
            className="
                h-55 flex flex-col items-start rounded-2xl px-4 py-4 border transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg bg-linear-to-br from-[#367BF4] via-[#1D5FE0] to-[#0D47C9] border-b border-blue-500 shadow-lg
            ">
            <CardContent className="flex flex-col gap-2">
                <div className="w-10 h-10 border border-blue-500 rounded-md overflow-hidden flex items-center justify-center bg-blue-400">
                    <Network className="text-white size-4" />
                </div>
                <h2 className="text-white font-extrabold text-3xl">
                    {getSaudacao()}, Geferson
                </h2>
                <p className="text-gray-200 font-normal text-sm">Bem-vindo ao <span className="font-bold">Nexus Gateway</span> — Plataforma centralizada de Intranet da Lusati</p>
                <div className="flex items-center gap-2 pt-2">
                    <Clock className="text-white size-5" />
                    <p className="text-gray-50 font-semibold text-lg italic">{tempo.toLocaleTimeString()}</p>
                    <p className="text-white">|</p>
                    <p className="text-gray-200 font-normal text-sm">
                        {tempo.toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}