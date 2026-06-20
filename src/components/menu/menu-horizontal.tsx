import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-context";
import { useUser } from "@/contexts/user-context";
import { ChevronRight, History, Info, LogOut, Moon, Sun, UserPen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { UpdatePasswordModal } from "../modals/change-user-modal";
import { EditUserModal } from "../modals/edit-user-modal";
import { Input } from "../ui/input";
import { AboutSystemModal } from "../modals/about-system-modal";

export function MenuComponent({ onSetFiltering }: { onSetFiltering?: (value: string) => void }) {
    const { user } = useUser();
    const navigate = useNavigate()
    const { theme, handleSetTheme } = useTheme();
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [aboutSystemModalOpen, setAboutSystemModalOpen] = useState(false);

    const isWelcomePage = window.location.pathname !== "/gateway"
    return (
        <div className="w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-between px-10 py-2 min-h-20 bg-(image:--background-gradient) items-center border-b border-border shadow-lg">
            <img src={`${theme === 'clean' ? './logo-dark.png' : './logo.png'}`} className="w-50 p-2 cursor-pointer" onClick={() => navigate('/welcome')} />
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
                {/* <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-primary-text text-[.8rem]">Online</span>
                </div>
                <div className="px-2 border border-primary/20 bg-primary/10 text-primary rounded-sm">
                    <span className="text-[.8rem] font-medium">v1.4.0</span>
                </div> */}
                {/* USER AREA */}
                <div className="shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="hover:bg-card flex items-center gap-2 p-2 rounded-lg cursor-pointer">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`${user?.logo}`} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className="flex w-full justify-between items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm">{user?.name}</span>
                                        <span className="text-[.7rem] text-muted-foreground">
                                            {user?.roleDescription}
                                        </span>
                                    </div>
                                    <ChevronRight />
                                </div>
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-background text-primary-text">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>

                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setEditProfileOpen(true);
                                    }}
                                >
                                    <UserPen size={16} />
                                    Editar Perfil
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setEditPasswordOpen(true);
                                    }}
                                >
                                    <History size={16} />
                                    Alterar Senha
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleSetTheme(theme === 'clean' ? 'dark' : 'clean')
                                    }}
                                >
                                    {theme === 'clean' ? (<Moon size={16} />) : <Sun size={16} />}
                                    Mudar Tema
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setAboutSystemModalOpen(true);
                                    }}
                                >
                                    <Info size={16} />
                                    Sobre o Sistema
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => navigate("/")}>
                                    <LogOut className="text-red-500" size={16} />
                                    Sair do Sistema
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* MODALS */}
            <EditUserModal
                open={editProfileOpen}
                onOpenChange={setEditProfileOpen}
                user={{
                    name: "Geferson Holdorf",
                    email: "geferson@lusati.com.br",
                    username: "gholdorf",
                    id: 1,
                }}
            />

            <UpdatePasswordModal
                userId={1}
                open={editPasswordOpen}
                onOpenChange={setEditPasswordOpen}
            />

            <AboutSystemModal
                open={aboutSystemModalOpen}
                onOpenChange={setAboutSystemModalOpen}
            />
        </div>
    )
}