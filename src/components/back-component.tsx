import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function BackComponent() {
    const navigate = useNavigate()
    return (
        <>
            <div
                className="flex gap-1 items-center cursor-pointer text-primary-text hover:text-muted-foreground"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="size-4" />
                <span className="text-sm">Voltar</span>
            </div>
            <span className="text-primary-text"> | </span>
        </>
    )
}