import { useNavigate } from "react-router";
import { Input } from "./ui/input";

export function MenuComponent({ onSetFiltering }: { onSetFiltering?: (value: string) => void }) {
    const navigate = useNavigate()

    const isWelcomePage = window.location.pathname !== "/gateway"
    return (
        <div className="w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-between px-10 py-2 min-h-20 bg-linear-to-br from-[#001B66] via-[#00185C] to-[#00144D] items-center border-b border-blue-900 shadow-lg">
            <img src="./logo.png" className="w-50 p-2 cursor-pointer" onClick={() => navigate('/welcome')} />
            <div>
                {!isWelcomePage && (
                    <Input
                        placeholder="Pesquisar Serviços ou Sistema..."
                        className="w-full"
                        onChange={(e) => onSetFiltering && onSetFiltering(e.target.value)}
                    />
                )}
            </div>
            <div className="flex gap-5 items-center w-fit justify-self-end px-2">
                <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-gray-200 text-[.8rem]">Online</span>
                </div>
                <div className="px-2 border border-blue-500 bg-blue-500 rounded-sm">
                    <span className="text-gray-200 text-[.8rem] font-medium">v1.4.0</span>
                </div>
            </div>
        </div>
    )
}