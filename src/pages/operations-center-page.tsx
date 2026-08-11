import { HeaderPage } from "@/components/header-page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, CircleCheck, Computer, Headset, MonitorCog, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Info, ShieldCheck, Zap } from "lucide-react";

export function AboutOperationsCenter() {
  const navigate = useNavigate();

  return (
    <section className="rounded-xl border border-border bg-(image:--background-gradient) p-6 shadow-lg">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        {/* Informações */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/50 bg-blue-500/5 text-blue-500">
              <Info className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Sobre a Central de Operações
              </h2>

              <p className="text-xs text-muted-foreground">
                Um único lugar para suas operações
              </p>
            </div>
          </div>

          <div className="mt-5 max-w-2xl space-y-3">
            <p className="text-sm leading-6 text-muted-foreground">
              A Central de Operações reúne os principais recursos utilizados
              pelas equipes da Lusati para gestão, acompanhamento e execução
              das operações de tecnologia.
            </p>

            <p className="text-sm leading-6 text-muted-foreground">
              Acesse rapidamente chamados, aprovações, mudanças, ativos e
              ferramentas de monitoramento em um ambiente centralizado.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-500 transition-colors hover:text-blue-400"
          >
            Conheça os recursos da plataforma
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Benefícios */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-lg border border-border/70 bg-background/20 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/5 text-emerald-500">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-medium">
                  Operação segura
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Recursos centralizados para uma operação mais organizada e
                  segura.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/20 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/5 text-amber-500">
                <Zap className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-medium">
                  Acesso centralizado
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Encontre rapidamente os recursos necessários para o seu
                  trabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ModuleOperations {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    iconDesign: string;
    moduleDesign: string;
    url: string;
    features: string[];
}

const modules: ModuleOperations[] = [
    {
        id: 1,
        title: "Central de Chamados",
        description: "Gerencie chamados, solicitações, SLAs e resoluções.",
        icon: Headset,
        iconDesign: "border-blue-500/50 bg-blue-500/5 text-blue-500",
        moduleDesign: "hover:border-blue-500/50",
        url: "tickets",
        features: [
            "Chamados",
            "SLAs",
            "Solicitações",
        ],
    },
    {
        id: 2,
        title: "Central de Aprovações",
        description: "Gerencie solicitações pendentes de validação.",
        icon: CircleCheck,
        iconDesign: "border-emerald-500/50 bg-emerald-500/5 text-emerald-500",
        moduleDesign: "hover:border-emerald-500/50",
        url: "approvals",
        features: [
            "Solicitações",
            "Pendências",
            "Validações",
        ],
    },
    {
        id: 4,
        title: "Central de Ativos",
        description: "Gerencie o inventário de ativos, equipamentos e softwares.",
        icon: Computer,
        iconDesign: "border-purple-500/50 bg-purple-500/5 text-purple-500",
        moduleDesign: "hover:border-purple-500/50",
        url: "assets",
        features: [
            "Inventário",
            "Equipamentos",
            "Softwares",
        ],
    },
    {
        id: 5,
        title: "Monitoramento",
        description: "Acompanhe a infraestrutura, servidores e serviços críticos.",
        icon: Activity,
        iconDesign: "border-red-500/50 bg-red-500/5 text-red-500",
        moduleDesign: "hover:border-red-500/50",
        url: "monitoring",
        features: [
            "Infraestrutura",
            "Servidores",
            "Serviços",
        ],
    },
];

export function OperationsCenterPage() {
    const navigate = useNavigate()
    return (
        <>
            <HeaderPage
                title="Central de Operações"
                description="Acesse os principais módulos de operações da Lusati."
                icon={MonitorCog}

                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Central de Operações</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex-1 px-16 py-8 space-y-6">
                <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {modules.map((module) => {
                        const Icon = module.icon;

                        return (
                            <div
                                key={module.id}
                                className={`
          group flex min-h-80 flex-col
          rounded-xl
          border border-border
          bg-(image:--background-gradient)
          p-5
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          ${module.moduleDesign}
        `}
                            >
                                {/* Ícone */}
                                <div
                                    className={`
            flex h-12 w-12 items-center justify-center
            rounded-xl border
            transition-transform duration-300
            group-hover:scale-105
            ${module.iconDesign}
          `}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                {/* Conteúdo */}
                                <div className="mt-5 flex flex-1 flex-col">
                                    <h3 className="text-base font-semibold">
                                        {module.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                                        {module.description}
                                    </p>

                                    {/* Recursos */}
                                    <div className="mt-5 space-y-2">
                                        {module.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex items-center gap-2 text-xs text-muted-foreground"
                                            >
                                                <span className="h-1 w-1 rounded-full bg-current" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Botão */}
                                <Button
                                    variant="outline"
                                    className="
            mt-6 w-full
            border-border
            bg-transparent
            text-muted-foreground
            transition-all
            group-hover:border-blue-500/50
            group-hover:text-blue-500
            hover:bg-transparent
          "
                                    onClick={() => navigate(`/${module.url}`)}
                                >
                                    Acessar Central
                                    <ArrowRight
                                        className="
              ml-auto h-4 w-4
              transition-transform duration-300
              group-hover:translate-x-1
            "
                                    />
                                </Button>
                            </div>
                        );
                    })}
                </div>
                <AboutOperationsCenter />
            </div>
        </>
    )
}