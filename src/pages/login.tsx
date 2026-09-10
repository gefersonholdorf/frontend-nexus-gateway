import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCampaignActive } from "@/contexts/campaign-active";
import { useTheme } from "@/contexts/theme-context";
import { useUser } from "@/contexts/user-context";
import { ApiClient } from "@/lib/api/api-client";
import { isApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/api/query-keys";
import { cn } from "@/lib/utils";
import { useLogin } from "@/modules/auth/hooks/use-login";
import type { MeResponse } from "@/modules/auth/hooks/use-me";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2Icon, Lock, LogIn, Mail, Moon, Sun } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false)

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
        <div className="relative min-h-screen w-screen overflow-hidden bg-(image:--background-gradient) flex items-center justify-center px-4 py-12">
            <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full text-primary/[0.07]"
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

            <div className="pointer-events-none absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-primary/25 blur-[130px]" />
            <div className="pointer-events-none absolute -bottom-48 -right-24 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-[150px]" />

            <div className="absolute top-6 right-6 z-10">
                <Tooltip>
                    <TooltipTrigger
                        onClick={() => handleSetTheme(theme === 'clean' ? 'dark' : 'clean')}
                        className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary cursor-pointer"
                    >
                        {theme === 'clean' ? <Sun className="size-4" /> : <Moon className="size-4" />}
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

            <div className="relative z-10 w-full max-w-[26rem] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <Card className="rounded-3xl border-border/60 bg-card/90 py-9 shadow-lg shadow-black/5 backdrop-blur-xl ring-1 ring-foreground/5 sm:py-10">
                    <CardContent className="px-8 sm:px-10">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/25 bg-primary/10">
                                <img src="/logo-nexus.png" alt={APP_NAME} className="h-8 w-8 object-contain" />
                            </div>
                            <div>
                                <p className="text-base font-semibold leading-tight text-foreground">{APP_NAME}</p>
                                <p className="text-xs text-muted-foreground">{APP_TAGLINE}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta para continuar</p>
                        </div>

                        <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-medium text-foreground">E-mail</label>
                                <div className="relative mt-1.5 flex items-center">
                                    <Mail className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
                                    <Input
                                        value={email}
                                        onChange={handleSetEmail}
                                        placeholder="nome@lusati.com.br"
                                        autoComplete="email"
                                        className={cn("h-11 pl-10", errors.email && "border-destructive")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-medium text-foreground">Senha</label>
                                <div className="relative mt-1.5 flex items-center">
                                    <Lock className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        placeholder="Informe sua senha"
                                        autoComplete="current-password"
                                        onChange={handleSetPassword}
                                        className={cn("h-11 pl-10 pr-10", errors.password && "border-destructive")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        tabIndex={-1}
                                        className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="mt-2 h-11 w-full font-semibold cursor-pointer"
                                disabled={mutation.isPending || isFinalizingLogin}
                            >
                                {mutation.isPending || isFinalizingLogin ? (
                                    <Loader2Icon className="animate-spin" />
                                ) : (
                                    <LogIn />
                                )}
                                Entrar na plataforma
                            </Button>
                        </form>

                        <p className="mt-7 text-center text-xs text-muted-foreground">
                            Problemas com acesso?{" "}
                            <span
                                className="cursor-pointer text-primary hover:underline"
                                onClick={() => window.open(SUPPORT_URL, "_blank")}
                            >
                                Contate o suporte
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <div className="mt-5 flex justify-center">
                    <span className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[.7rem] font-medium text-muted-foreground backdrop-blur-md">
                        {APP_NAME} {APP_VERSION}
                    </span>
                </div>
            </div>
        </div>
    )
}
