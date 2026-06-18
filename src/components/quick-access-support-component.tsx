import {
    Mail,
    MessageCircle,
    ShieldCheck,
    ChevronRight,
    Link,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
    {
        title: "WhatsApp",
        description: "Atendimento imediato",
        icon: MessageCircle,
        color: 'text-emerald-500',
        href: "https://wa.me/554896366798",
    },
    {
        title: "E-mail Suporte",
        description: "Envie um e-mail para o suporte",
        icon: Mail,
        color: 'text-blue-500',
        href: "mailto:suporte@lusati.com.br",
    },
    {
        title: "E-mail Comitê SGCI",
        description: "Envie um e-mail relacionado a segurança da informação",
        icon: ShieldCheck,
        color: 'text-purple-500',
        href: "mailto:sgci@lusati.com.br",
    },
];

export function QuickAccessSupportComponent() {
    return (
        <Card
            className="
                p-6
                h-80
                rounded-3xl
                border-border/50
                bg-card
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
            "
        >
            <CardContent className="h-full p-0">
                <div className="flex h-full flex-col">
                    <div className="mb-5 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                                <Link className="size-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-primary-text">
                                    Comunicação
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Canais oficiais da Lusati
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        {actions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <button
                                    key={action.title}
                                    onClick={() =>
                                        window.open(
                                            action.href,
                                            "_blank"
                                        )
                                    }
                                    className="
                                        group
                                        cursor-pointer
                                        flex
                                        items-center
                                        justify-between
                                        rounded-sm
                                        px-3
                                        py-3

                                        transition-all
                                        border border-border
                                        hover:bg-muted/50
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                
                                                bg-muted
                                            "
                                        >
                                            <Icon className={`size-4 ${action.color}`} />
                                        </div>

                                        <div className="text-left">
                                            <p className="text-sm font-medium">
                                                {action.title}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        className="
                                            size-4

                                            text-muted-foreground

                                            transition-transform

                                            group-hover:translate-x-1
                                        "
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}