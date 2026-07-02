import type { TooltipRenderProps } from "react-joyride";

export function CustomTooltip({
    step,
    tooltipProps,
    primaryProps,
    backProps,
    index,
    size
}: TooltipRenderProps) {
    const isLastStep = index === size - 1;
    return (
        <div
            {...tooltipProps}
            className="
                w-105 rounded-2xl border bg-(image:--background-gradient) p-6 shadow-lg
            "
        >
            <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-blue-400">
                    Tour do Sistema
                </span>

                <h2 className="text-[1.1rem] font-bold text-primary-text">
                    {step.title || "Nexus Gateway"}
                </h2>

                <div className="text-muted-foreground text-sm">
                    {step.content}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <button
                    {...backProps}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-primary-text"
                >
                    Voltar
                </button>

                <button
                    {...primaryProps}
                    className="rounded-lg text-sm bg-blue-600 px-4 py-2 text-white"
                >
                    {isLastStep ? "Finalizar" : "Próximo"}
                </button>
            </div>

            <div className="mt-3 text-xs text-zinc-500">
                Passo {index + 1}
            </div>
        </div>
    );
}