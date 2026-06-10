import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/theme-context";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, Lock, LogIn, Mail, Moon, Network, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginPage() {
    const mutation = useMutation({
        mutationKey: ["login"],
        mutationFn: async ({
            email,
            password,
        }: {
            email: string
            password: string
        }) => {
            const response = await fetch("http://127.0.0.1:3336/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (!response.ok) {
                throw new Error("Usuário ou senha inválidos")
            }

            return response.json()
        },
    })

    const { setUserName } = useUser();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate()

    const { theme, handleSetTheme } = useTheme()

    function handleSetEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)

        if (errors.email) {
            setErrors(prev => ({
                ...prev,
                email: "",
            }))
        }
    }

    function handleSetPassword(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value)

        if (errors.password) {
            setErrors(prev => ({
                ...prev,
                password: "",
            }))
        }
    }

    async function handleLogin(e?: React.FormEvent) {
        e?.preventDefault()

        const newErrors = {
            email: "",
            password: "",
        }

        if (!email.trim()) {
            newErrors.email = "Informe seu e-mail"
        }

        if (!password.trim()) {
            newErrors.password = "Informe sua senha"
        }

        if (newErrors.email || newErrors.password) {
            setErrors(newErrors)
            return
        }

        setErrors({
            email: "",
            password: "",
        })

        try {
            const result = await mutation.mutateAsync({
                email,
                password,
            })

            setUserName(result?.user?.name)

            localStorage.setItem('user', JSON.stringify({
                user: {
                    name: result?.user?.name,
                    token: result?.user?.token
                }
            }))

            toast.success("Login realizado com sucesso.", {
                position: "top-center",
                richColors: true,
            })

            navigate("/welcome")
        } catch (error) {
            toast.error("Erro ao realizar login, verifique suas credenciais.", {
                position: "top-center",
                richColors: true,
            })
        }
    }

    return (
        <div className="h-screen w-screen p-x grid grid-cols-1 lg:grid-cols-2">
            <div
                className={cn(
                    "bg-cover bg-center shadow-lg bg-no-repeat hidden lg:flex flex-col justify-between px-16 py-16",
                    theme === "clean" && "bg-[url('/logo-light-1.png')]",
                    theme === "dark" && "bg-[url('/logo-dark-1.png')]",
                )}
            >
                <div className="flex items-center gap-2">
                </div>
                <div className="flex flex-col gap-4 max-w-3/5">
                </div>
                <div className="mt-8 w-full flex items-end justify-between">
                    <div></div>
                    <div className="px-2 border border-primary bg-primary/10 text-primary rounded-sm">
                        <span className="text-[.8rem] font-medium">v1.4.0</span>
                    </div>
                </div>
            </div>
            <div className=" bg-(image:--background-gradient) w-full flex flex-col justify-center items-start px-16">
                <div className="mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary flex items-center justify-center">
                        <Network className="text-primary size-5" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-primary-text">
                            Nexus Gateway
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Plataforma Corporativa de Intranet da Lusati
                        </p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger>
                            {theme === 'clean' ? (
                                <Sun className="text-primary-text size-5 hover:text-blue-500 cursor-pointer" onClick={() => handleSetTheme('dark')} />
                            ) : (
                                <Moon className="text-primary-text size-5 hover:text-blue-500 cursor-pointer" onClick={() => handleSetTheme('clean')} />
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
                </div>
                <h3 className="text-3xl font-bold text-primary-text">Entrar</h3>
                <p className="text-[.9rem] font-normal text-muted-foreground mt-2">Acesse sua conta para continuar</p>
                <form onSubmit={handleLogin} className="w-full">
                    <div className="mt-6 mb-6 space-y-2 w-full">
                        <div className="w-full">
                            <span className="text-[.8rem] text-primary-text">E-mail</span>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    value={email}
                                    onChange={handleSetEmail}
                                    placeholder="Informe seu email..."
                                    className={`pl-10 w-full py-5 ${errors.email ? "border-red-500" : ""
                                        }`}
                                />
                            </div>

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="w-full">
                            <span className="text-[.8rem] text-primary-text">Senha</span>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    type="password"
                                    value={password}
                                    placeholder="Informe sua senha..."
                                    onChange={handleSetPassword}
                                    className={`w-full pl-10 py-5 ${errors.password ? "border-red-500" : ""
                                        }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button
                        className="w-full shadow-sm shadow-background p-5 font-bold cursor-pointer bg-primary text-secondary hover:text-primary-text"
                        onClick={handleLogin}>
                        {mutation.isPending ? <Loader2Icon className="animate-spin" /> : <LogIn />}
                        Entrar na plataforma
                    </Button>
                </form>
                <div className="w-full text-center pt-8">
                    <span className="text-[.8rem] font-normal text-primary-text">
                        Problemas com acesso? <span className="text-blue-600 cursor-pointer hover:underline">Contate o suporte</span>
                    </span>
                </div>
            </div>
        </div >
    )
}