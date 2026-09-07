import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface CoreEntityCardProps {
    icon: LucideIcon;
    title: string;
    status?: ReactNode;
    description?: string;
    footer?: ReactNode;
    actions?: ReactNode;
    onClick?: () => void;
    className?: string;
}

/**
 * Casca de card usada por Módulos e Integrações (Etapas 5 e 6) — estrutura fixa
 * (cabeçalho / corpo / rodapé), reaproveitada por várias telas, não recriada
 * por página. Ver "Direção visual do Core" no plano de reconstrução.
 */
export function CoreEntityCard({
    icon: Icon,
    title,
    status,
    description,
    footer,
    actions,
    onClick,
    className,
}: CoreEntityCardProps) {
    const isInteractive = Boolean(onClick);

    return (
        <Card
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onClick={onClick}
            onKeyDown={
                isInteractive
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onClick?.();
                        }
                    }
                    : undefined
            }
            className={cn(
                "flex flex-col gap-3 rounded-sm border border-border/60 bg-(image:--background-gradient) p-4 py-4 text-left shadow-sm transition-all duration-200",
                isInteractive &&
                "cursor-pointer hover:-translate-y-0.5 hover:border-core-signal hover:shadow-md",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-core-ink/15 bg-core-ink/5 text-core-ink">
                        <Icon className="size-4" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
                        {status}
                    </div>
                </div>

                {actions}
            </div>

            {description && (
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{description}</p>
            )}

            {footer && (
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                    {footer}
                </div>
            )}
        </Card>
    );
}
