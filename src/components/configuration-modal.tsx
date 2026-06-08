import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cog, Palette } from "lucide-react"
import { useState } from "react"
import type React from "react"
import { Button } from "./ui/button"

interface ConfigurationModalProps {
    children: React.ReactNode
}

export function ConfigurationModal({
    children,
}: ConfigurationModalProps) {
    const [activeTab, setActiveTab] = useState("appearance")

    const [colors, setColors] = useState({
        from: "#020B3F",
        via: "#030A35",
        to: "#010726",
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="w-3/5 p-2">
                <DialogHeader className="border-b bg-muted/40 p-6">
                    <DialogTitle>
                        Configurações do Sistema
                    </DialogTitle>

                    <DialogDescription>
                        Gerencie os parâmetros do seu Nexus Gateway
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-[250px_1fr] min-h-[500px]">
                    {/* MENU LATERAL */}
                    <aside className="border-r bg-muted/20">
                        <button
                            onClick={() =>
                                setActiveTab("appearance")
                            }
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === "appearance"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            <Palette size={18} />
                            <span>Aparência</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("general")}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeTab === "general"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                                }`}
                        >
                            <Cog size={18} />
                            <span>Geral</span>
                        </button>
                    </aside>

                    {/* CONTEÚDO */}
                    <section className="p-6">
                        {activeTab === "appearance" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        Aparência
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Personalize as cores do
                                        gradiente do sistema.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>
                                            Cor Inicial
                                        </Label>

                                        <Input
                                            type="color"
                                            value={colors.from}
                                            onChange={(e) =>
                                                setColors(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        from: e
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Cor Intermediária
                                        </Label>

                                        <Input
                                            type="color"
                                            value={colors.via}
                                            onChange={(e) =>
                                                setColors(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        via: e
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Cor Final
                                        </Label>

                                        <Input
                                            type="color"
                                            value={colors.to}
                                            onChange={(e) =>
                                                setColors(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        to: e
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* PREVIEW */}
                                <div>
                                    <Label>
                                        Pré-visualização
                                    </Label>

                                    <div
                                        className="h-40 rounded-lg border mt-2"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "general" && (
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Configurações Gerais
                                </h3>

                                <p className="text-muted-foreground text-sm mt-2">
                                    Em breve...
                                </p>
                            </div>
                        )}
                    </section>
                </div>
                <DialogFooter>
                    <Button>
                        Cancelar
                    </Button>
                    <Button>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}