import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface SettingsSectionProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    canManage?: boolean;
    children: ReactNode;
}

export function SettingsSection({
    title,
    description,
    actionLabel = "Novo",
    onAction,
    canManage = false,
    children,
}: SettingsSectionProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>

                {canManage && onAction && (
                    <Button onClick={onAction} className="shrink-0">
                        <Plus /> {actionLabel}
                    </Button>
                )}
            </CardHeader>

            <CardContent>{children}</CardContent>
        </Card>
    );
}