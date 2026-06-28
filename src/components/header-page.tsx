import type { LucideIcon } from "lucide-react";
import { BackComponent } from "./back-component";

interface HeaderPageProps {
    title: string
    description: string
    icon: LucideIcon
    breadcrumb?: React.ReactNode
    actions?: React.ReactNode
}

export function HeaderPage({ actions, breadcrumb, description, icon: Icon, title }: HeaderPageProps) {
    return (
        <div className="px-10 pt-8">
            {breadcrumb}
            <div className="pt-4 flex flex-col lg:flex-row justify-start items-start border-b border-border bg-background pb-4 rounded-b-lg">
                <div className="w-full flex flex-col lg:flex-row gap-3 items-center justify-between">
                    <div className="flex gap-3 items-center">
                        <BackComponent />
                        <div className="w-10 h-10 border border-primary rounded-md overflow-hidden flex items-center justify-center bg-background/20">
                            <Icon className="text-primary size-4" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">{title}</h1>
                            <p className="text-muted-foreground text-[.8rem]">{description}</p>
                        </div>
                    </div>
                </div>
                {actions}
            </div>
        </div>
    )
}