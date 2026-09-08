import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCampaignActive } from "@/contexts/campaign-active";
import { useTheme } from "@/contexts/theme-context";
import { useUser } from "@/contexts/user-context";
import { ApiClient } from "@/lib/api/api-client";
import { isApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/api/query-keys";
import { useLogin } from "@/modules/auth/hooks/use-login";
import type { MeResponse } from "@/modules/auth/hooks/use-me";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Lock, LogIn, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const APP_NAME = "Nexus Gateway"
const APP_TAGLINE = "Plataforma Corporativa de Intranet da Lusati"
const APP_VERSION = "v1.6.0"
const SUPPORT_URL = "https://wa.me/554896366798"

export function LoginPage() {
    const { onLoginCompleted } = useCampaignActive()
    const mutation = useLogin()
    const queryClient = useQueryClient()

    const { setUser } = useUser();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })

    const [isFinalizingLogin, setIsFinalizingLogin] = useState(false)

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

        let response: Awaited<ReturnType<typeof mutation.mutateAsync>>

        try {
            response = await mutation.mutateAsync({
                ds_email: email,
                senha: password,
            })
        } catch (error) {
            if (isApiError(error) && (error.status === 401 || error.status === 400)) {
                toast.error("Erro ao realizar login, verifique suas credenciais.", {
                    position: "top-center",
                    richColors: true,
                })
            } else {
                console.error(error)
                toast.error("Não foi possível concluir o login. Tente novamente ou contate o suporte.", {
                    position: "top-center",
                    richColors: true,
                })
            }
            return
        }

        if (!response?.token) {
            console.error("Resposta de login em formato inesperado:", response)
            toast.error("Não foi possível concluir o login. Tente novamente ou contate o suporte.", {
                position: "top-center",
                richColors: true,
            })
            return
        }

        setIsFinalizingLogin(true)

        const token = response.token

        let meResponse: MeResponse

        try {
            const meApi = new ApiClient({
                getToken: () => token,
                onUnauthorized: () => { },
            })

            meResponse = await meApi.get<MeResponse>("/me", {
                errorMessage: "Erro ao carregar dados do usuário",
            })
        } catch (error) {
            console.error(error)
            setIsFinalizingLogin(false)
            toast.error("Não foi possível carregar os dados do usuário. Tente novamente.", {
                position: "top-center",
                richColors: true,
            })
            return
        }

        queryClient.setQueryData(queryKeys.me(), meResponse)

        setUser({
            email: meResponse.user.ds_email,
            name: meResponse.user.ds_name,
            roleDescription: meResponse.user.ds_role_description ?? "",
            logo: meResponse.user.ds_avatar_url,
            roles: meResponse.roles.map((role) => role.ds_name),
            permissions: meResponse.permissions,
            token,
        })

        setIsFinalizingLogin(false)

        toast.success("Login realizado com sucesso.", {
            position: "top-center",
            richColors: true,
        })

        navigate("/core")

        onLoginCompleted(true)
    }

    return (
        <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden px-16 py-16 bg-[#0B1220]">
                <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full text-primary/8"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <pattern id="login-hex-pattern" width="56" height="100" patternUnits="userSpaceOnUse">
                            <path
                                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#login-hex-pattern)" />
                </svg>

                <div className="relative flex items-center gap-3">
                    <img src="/logo-nexus.png" alt={APP_NAME} className="h-9 w-9" />
                    <span className="text-sm font-semibold text-white/80">{APP_NAME}</span>
                </div>

                <div className="relative flex flex-col gap-3 max-w-md">
                    <h2 className="text-3xl font-bold leading-tight text-white">
                        Gestão operacional em um só lugar
                    </h2>
                    <p className="text-sm text-white/70">
                        {APP_TAGLINE}
                    </p>
                </div>

                <div className="relative mt-8 w-full flex items-end justify-between">
                    <div></div>
                    <div className="px-2 border border-primary bg-primary/10 text-primary rounded-sm">
                        <span className="text-[.8rem] font-medium">{APP_VERSION}</span>
                    </div>
                </div>
            </div>
            <div className="bg-(image:--background-gradient) w-full flex flex-col justify-center items-start px-16">
                <div className="mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary flex items-center justify-center overflow-hidden">
                        <img src="/logo-nexus.png" alt={APP_NAME} className="h-8 w-8 object-contain" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-primary-text">
                            {APP_NAME}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {APP_TAGLINE}
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
                        disabled={mutation.isPending || isFinalizingLogin}
                        onClick={handleLogin}>
                        {mutation.isPending || isFinalizingLogin ? <Loader2Icon className="animate-spin" /> : <LogIn />}
                        Entrar na plataforma
                    </Button>
                </form>
                <div className="w-full text-center pt-8">
                    <span className="text-[.8rem] font-normal text-primary-text">
                        Problemas com acesso? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => window.open(SUPPORT_URL, "_blank")}>Contate o suporte</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
