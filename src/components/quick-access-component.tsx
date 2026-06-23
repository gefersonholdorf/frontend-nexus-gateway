import { Link, GitBranch, Bug, Clock, Server, Book } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "./ui/card";

interface QuickAccess {
    id: number;
    title: string;
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    url: string
}

const quickAccess: QuickAccess[] = [
    {
        id: 1,
        title: "Ponto Eletrônico",
        icon: Clock,
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        iconColor: "text-emerald-500",
        url: "https://app2.pontomais.com.br/registrar-ponto",
    },
    {
        id: 2,
        title: "Jira",
        icon: Bug,
        bgColor: "bg-blue-50 dark:bg-blue-500/10",
        iconColor: "text-blue-500",
        url: "https://lusati.atlassian.net",
    },
    {
        id: 3,
        title: "Gitea",
        icon: GitBranch,
        bgColor: "bg-purple-50 dark:bg-purple-500/10",
        iconColor: "text-purple-500",
        url: "https://gitea.lusati.com.br"
    },
    {
        id: 4,
        title: "SharePoint",
        icon: Book,
        bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
        iconColor: "text-cyan-500",
        url: "https://lusati.sharepoint.com/_layouts/15/sharepoint.aspx",
    },
    {
        id: 6,
        title: "GLPI",
        icon: Server,
        bgColor: "bg-orange-50 dark:bg-orange-500/10",
        iconColor: "text-orange-500",
        url: "https://glpi.lusati.com.br/Helpdesk",
    },
];

export function QuickAccessComponent() {
    return (
        <Card
            className="
                w-full
                rounded-2xl
                border
                border-border
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
            "
        >
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <Link className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Acesso Rápido
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Sistemas e ferramentas
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                        sm:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-5
                    "
                >
                    {quickAccess.map((access) => {
                        const Icon = access.icon;

                        return (
                            <button
                                key={access.id}
                                type="button"
                                className="
                                    group
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-3
                                    rounded-xl
                                    border-2
                                    border-border
                                    bg-(image:--background-gradient)
                                    p-4
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-primary/30
                                    hover:shadow-md cursor-pointer
                                "
                                onClick={() => window.open(`${access.url}`, "_black")}
                            >
                                <div
                                    className={`
                                        ${access.bgColor}
                                        rounded-xl
                                        p-3
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                    `}
                                >
                                    <Icon
                                        className={`
                                            ${access.iconColor}
                                            size-5
                                        `}
                                    />
                                </div>

                                <span className="text-center text-sm font-medium text-primary-text">
                                    {access.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}