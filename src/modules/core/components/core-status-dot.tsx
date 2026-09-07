import { cn } from "@/lib/utils";

export type StatusDotTone = "ok" | "off" | "fail";

interface StatusDotProps {
    tone: StatusDotTone;
    label: string;
    className?: string;
}

const TONE_STYLES: Record<StatusDotTone, { dot: string; text: string }> = {
    ok: { dot: "bg-core-ok", text: "text-core-ok" },
    fail: { dot: "bg-core-fail", text: "text-core-fail" },
    off: { dot: "bg-core-neutral", text: "text-core-neutral" },
};

/**
 * Sinal de status do módulo Core — nunca só cor, sempre ícone (dot) + texto.
 *
 * <StatusDot tone="ok" label="Ativo" />
 */
export function StatusDot({ tone, label, className }: StatusDotProps) {
    const styles = TONE_STYLES[tone];

    return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
            <span className={cn("size-2 shrink-0 rounded-full", styles.dot)} aria-hidden="true" />
            <span className={styles.text}>{label}</span>
        </span>
    );
}
