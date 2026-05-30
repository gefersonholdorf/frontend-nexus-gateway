import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function BackComponent() {
    const navigate = useNavigate()
    return (
        <>
            <div
                className="flex gap-1 items-center cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => navigate('/welcome')}
            >
                <ArrowLeft className="size-4" />
                <span className="text-sm">Voltar</span>
            </div>
            <span className="text-gray-300"> | </span>
        </>
    )
}