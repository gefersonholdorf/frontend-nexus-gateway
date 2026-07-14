import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  LoaderCircle,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import { CardChart } from "./card-chart";

interface CardData {
  title: string;
  details: string;
  icon: LucideIcon;
  quantity: number;
  textColor: string;
}

const cards: CardData[] = [
  {
    title: "Total de Documentos",
    details: "+12 este mês",
    icon: FileText,
    quantity: 328,
    textColor: "#3790E7",
  },
  {
    title: "Vigentes",
    details: "+12 este mês",
    icon: BadgeCheck,
    quantity: 246,
    textColor: "#22C55E",
  },
  {
    title: "Pendentes",
    details: "+12 este mês",
    icon: Clock3,
    quantity: 21,
    textColor: "#F59E0B",
  },
  {
    title: "Em Andamento",
    details: "+12 este mês",
    icon: LoaderCircle,
    quantity: 17,
    textColor: "#3B82F6",
  },
  {
    title: "Em Revisão",
    details: "+12 este mês",
    icon: RefreshCcw,
    quantity: 44,
    textColor: "#A855F7",
  },
  {
    title: "Acessos",
    details: "+12 este mês",
    icon: Eye,
    quantity: 5847,
    textColor: "#06B6D4",
  },
  {
    title: "Nunca Acessados",
    details: "+12 este mês",
    icon: EyeOff,
    quantity: 39,
    textColor: "#EF4444",
  },
  {
    title: "Crescimento no Período",
    details: "+12 este mês",
    icon: TrendingUp,
    quantity: 27,
    textColor: "#10B981",
  },
];

export function Indicator() {
  return (
    <CardChart
      title="Indicadores dos Documentos"
      description="Métricas detalhadas dos documentos"
    >
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="flex gap-3 rounded-lg border border-border bg-(image:--background-gradient) p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                <card.icon
                  className="size-5"
                  style={{ color: card.textColor }}
                />
              </div>

              <span className="text-lg font-bold text-primary-text">
                {card.quantity}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-semibold text-primary-text">
                {card.title}
              </span>

              <span className="text-sm text-muted-foreground">
                {card.details}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </CardChart>
  );
}