import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MonoValueProps {
    children: ReactNode;
    className?: string;
}

/**
 * Wrapper para dado bruto do módulo Core (chaves, IDs, IP, timestamps, segredos
 * mascarados) — usa a fonte monoespaçada do sistema (`--font-mono`, sem pacote
 * novo). Texto humano continua na fonte padrão do app; mono é só para código.
 */
export function MonoValue({ children, className }: MonoValueProps) {
    return (
        <span className={cn("font-mono text-xs text-foreground/80", className)}>
            {children}
        </span>
    );
}
