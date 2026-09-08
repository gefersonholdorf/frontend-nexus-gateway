import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type HubServiceStatusState = "idle" | "checking" | "up" | "down";

interface HubServiceStatusBadgeProps {
    state: HubServiceStatusState;
    httpStatus?: number;
    message?: string;
    className?: string;
}

const TONE_STYLES: Record<Exclude<HubServiceStatusState, "checking">, { dot: string; text: string }> = {
    idle: { dot: "bg-core-neutral", text: "text-core-neutral" },
    up: { dot: "bg-core-ok", text: "text-core-ok" },
    down: { dot: "bg-core-fail", text: "text-core-fail" },
};

/**
 * Resultado da verificação de status (RN009) — nunca só cor, sempre
 * ícone/dot + texto. `httpStatus` aparece em UP e DOWN; `message` só em DOWN.
 */
export function HubServiceStatusBadge({
    state,
    httpStatus,
    message,
    className,
}: HubServiceStatusBadgeProps) {
    if (state === "checking") {
        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
                    className,
                )}
            >
                <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden="true" />
                <span>Verificando...</span>
            </span>
        );
    }

    const label =
        state === "idle" ? "Ainda não verificado" : state === "up" ? "Disponível" : "Indisponível";

    const styles = TONE_STYLES[state];

    return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
            <span className={cn("size-2 shrink-0 rounded-full", styles.dot)} aria-hidden="true" />
            <span className={styles.text}>
                {label}
                {state !== "idle" && httpStatus != null ? ` (${httpStatus})` : null}
            </span>
            {state === "down" && message ? (
                <span className="text-muted-foreground" title={message}>
                    — {message}
                </span>
            ) : null}
        </span>
    );
}
