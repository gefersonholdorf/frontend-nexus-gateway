import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, Lock, LogIn, Mail, Network } from "lucide-react";
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
                className="bg-[url('/4.png')] bg-cover bg-center bg-no-repeat hidden 
                lg:flex flex-col justify-between px-16 py-16"
            >
                <div className="flex items-center gap-2">
                </div>
                <div className="flex flex-col gap-4 max-w-3/5">

                </div>

                <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-primary-text text-[.8rem] font-normal">
                            © 2026 Geferson Holdorf — Nexus Gateway
                        </span>
                        <span className="text-primary-text text-[.8rem] font-semibold">
                            v1.4.0
                        </span>
                    </div>
                </div>
            </div>
            <div className=" bg-(image:--background-gradient) w-full flex flex-col justify-center items-start px-16">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-(image:--background-gradient) flex items-center justify-center">
                        <Network className="text-primary-text size-5" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-primary-text">
                            Nexus Gateway
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Plataforma Corporativa de Intranet da Lusati
                        </p>
                    </div>
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
                        className="w-full shadow-sm shadow-background p-5 font-bold cursor-pointer bg-background text-primary-text"
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
        </div>
    )
}