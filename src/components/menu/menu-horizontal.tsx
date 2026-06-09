import { Bell, Cog, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { Input } from "../ui/input";
import { ConfigurationModal } from "../configuration-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTheme } from "@/contexts/theme-context";

export function MenuComponent({ onSetFiltering }: { onSetFiltering?: (value: string) => void }) {
    const navigate = useNavigate()
    const { theme, handleSetTheme } = useTheme();

    const isWelcomePage = window.location.pathname !== "/gateway"
    return (
        <div className="w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-between px-10 py-2 min-h-20 bg-(image:--background-gradient) items-center border-b border-blue-900 shadow-lg">
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
                <Tooltip>
                    <TooltipTrigger>
                        {theme === 'clean' ? (
                            <Sun className="text-white size-5 hover:text-blue-500 cursor-pointer" onClick={() => handleSetTheme('dark')} />
                        ) : (
                            <Moon className="text-white size-5 hover:text-blue-500 cursor-pointer" onClick={() => handleSetTheme('clean')} />
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        {theme === 'clean' ? (
                            <span>Mudar para tema escuro</span>
                        ) : (
                            <span>Mudar para tema claro</span>
                        )}
                    </TooltipContent>
                </Tooltip>
                <Bell className="text-white size-5 hover:text-blue-500 cursor-pointer" />
                <Tooltip>
                    <TooltipTrigger>
                        <ConfigurationModal>
                            <Cog className="text-white size-5 hover:text-blue-500 cursor-pointer" />
                        </ConfigurationModal>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Configurações do Sistema</span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}