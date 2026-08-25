import type { LucideIcon } from "lucide-react"

import {
    CheckCircle2,
    FileCheck2,
    FilePlus2,
    Files,
    GitPullRequestArrow,
    Info,
    ArrowRight,
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
    iconClassName: string
    iconContainerClassName: string
}

const documentFlowSteps: DocumentFlowStep[] = [
    {
        id: 1,
        title: "Criação",
        description: "Documento cadastrado no sistema como rascunho.",
        icon: FilePlus2,
        iconClassName: "text-blue-500",
        iconContainerClassName: "border-blue-500/30 bg-blue-500/10",
    },
    {
        id: 2,
        title: "Revisão",
        description: "Alterações, melhorias são registradas.",
        icon: GitPullRequestArrow,
        iconClassName: "text-cyan-500",
        iconContainerClassName: "border-cyan-500/30 bg-cyan-500/10",
    },
    {
        id: 3,
        title: "Versão",
        description: "Criação e alterações de versões na revisão.",
        icon: Files,
        iconClassName: "text-violet-500",
        iconContainerClassName: "border-violet-500/30 bg-violet-500/10",
    },
    {
        id: 4,
        title: "Aprovação",
        description: "A versão candidata passa pelo fluxo de aprovação definido para cada caso.",
        icon: FileCheck2,
        iconClassName: "text-amber-500",
        iconContainerClassName: "border-amber-500/30 bg-amber-500/10",
    },
    {
        id: 5,
        title: "Publicação",
        description: "Versão aprovada fica disponível aos autorizados.",
        icon: CheckCircle2,
        iconClassName: "text-emerald-500",
        iconContainerClassName: "border-emerald-500/30 bg-emerald-500/10",
    },
]

export function DocumentFlowCard() {
    return (
        <Card className="overflow-hidden rounded-lg border border-border bg-(image:--background-gradient) shadow-sm p-6">
            <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2 text- font-semibold">
                    Ciclo de Criação do Documento
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                    Da criação à publicação, cada etapa mantém o histórico e a
                    rastreabilidade do documento.
                </p>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    {documentFlowSteps.map((step, index) => {
                        const StepIcon = step.icon

                        return (
                            <div
                                key={step.id}
                                className="group relative flex flex-col items-start gap-1 rounded-lg p-4 transition-all duration-200 hover:border-primary/30 hover:bg-background/60"
                            >
                                <div className="w-full h-ful flex gap-2 justify-start items-center">
                                    <div
                                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${step.iconContainerClassName}`}
                                    >
                                        <StepIcon
                                            className={`size-4 ${step.iconClassName}`}
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            0{step.id}
                                        </span>

                                        <h3 className="truncate text-sm font-semibold">
                                            {step.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="mt-0.5 line-clamp-2 text-[.8rem] leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>

                                {index < documentFlowSteps.length - 1 && (
                                    <ArrowRight className="absolute -right-4 z-10 hidden size-4 text-muted-foreground/40 lg:block" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}