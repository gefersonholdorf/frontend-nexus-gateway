import { LayoutGrid, Table as TableIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HubServiceViewMode = "table" | "cards";

interface HubServiceViewToggleProps {
    value: HubServiceViewMode;
    onChange: (value: HubServiceViewMode) => void;
}

/**
 * Alternância entre os dois modos de visualização da listagem (RF001).
 */
export function HubServiceViewToggle({ value, onChange }: HubServiceViewToggleProps) {
    return (
        <div className="flex items-center rounded-md border border-border/60 p-0.5">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", value === "table" && "bg-muted")}
                aria-pressed={value === "table"}
                onClick={() => onChange("table")}
            >
                <TableIcon className="size-4" />
                <span className="sr-only">Ver como tabela</span>
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("size-8", value === "cards" && "bg-muted")}
                aria-pressed={value === "cards"}
                onClick={() => onChange("cards")}
            >
                <LayoutGrid className="size-4" />
                <span className="sr-only">Ver como cards</span>
            </Button>
        </div>
    );
}
