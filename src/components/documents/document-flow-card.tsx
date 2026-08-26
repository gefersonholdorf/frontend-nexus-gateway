import type { LucideIcon } from "lucide-react"

import {
    CheckCircle2,
    FileCheck2,
    FilePlus2,
    Files,
    GitPullRequestArrow,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface DocumentFlowStep {
    id: number
    title: string
    description: string
    icon: LucideIcon
    color: string
}

const documentFlowSteps: DocumentFlowStep[] = [
    {
        id: 1,
        title: "Documento",
        description: "Cadastro inicial do documento.",
        icon: FilePlus2,
        color: "text-blue-500",
    },
    {
        id: 2,
        title: "Revisões",
        description: "Alterações registradas.",
        icon: GitPullRequestArrow,
        color: "text-cyan-500",
    },
    {
        id: 3,
        title: "Versionamento",
        description: "Controle de versões.",
        icon: Files,
        color: "text-violet-500",
    },
    {
        id: 4,
        title: "Aprovações",
        description: "Fluxo de aprovação.",
        icon: FileCheck2,
        color: "text-amber-500",
    },
    {
        id: 5,
        title: "Vigente",
        description: "Documento publicado.",
        icon: CheckCircle2,
        color: "text-emerald-500",
    },
]

export function DocumentFlowCard() {
    return (
        <Card className="overflow-hidden border-border/50 bg-(image:--background-gradient)">
            <CardHeader>
                <CardTitle>
                    Ciclo de Vida do Documento
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="relative">

                    {/* Linha principal */}
                    <div className="absolute left-0 right-0 top-8 h-0.5 bg-border" />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-5">

                        {documentFlowSteps.map((step) => {
                            const Icon = step.icon

                            return (
                                <div
                                    key={step.id}
                                    className="relative flex flex-col items-center text-center"
                                >
                                    {/* Circulo */}
                                    <div
                                        className="
                      z-10
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-border
                      bg-card
                      shadow-sm
                    "
                                    >
                                        <Icon className={`h-4 w-4 ${step.color}`} />
                                    </div>

                                    <div className="flex gap-2 justify-center items-center">
                                        <h3 className="mt-1 text-sm font-semibold">
                                            {step.title}
                                        </h3>
                                    </div>

                                    {/* Descrição */}
                                    <p className="mt-2 max-w-45 text-xs leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}