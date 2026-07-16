import { useFetchDocumentsMetrics } from "@/api/documents/documents-metrics";
import { Card } from "@/components/ui/card";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  FileText
} from "lucide-react";
import { CardChart } from "./card-chart";

export function Indicator() {
  const { data, isLoading } = useFetchDocumentsMetrics({
    period: "30d",
  });

  if (isLoading) {
    return <>Carregando...</>;
  }

  const metrics = data!.metrics;

  const cards = [
    {
      title: "Total de Documentos",
      details: metrics.totalDocuments.growth,
      icon: FileText,
      quantity: metrics.totalDocuments.value,
      textColor: "#3790E7",
    },
    {
      title: "Taxa de Vigência",
      details: metrics.totalCurrentRate.growth,
      icon: BadgeCheck,
      quantity: `${metrics.totalCurrentRate.value}%`,
      textColor: "#22C55E",
    },
    {
      title: "Acessos",
      details: metrics.totalAccess.growth,
      icon: Eye,
      quantity: metrics.totalAccess.value,
      textColor: "#06B6D4",
    },
    {
      title: "Documentos Nunca Acessados",
      details: metrics.totalDocumentsNeverAccessed.growth,
      icon: EyeOff,
      quantity: `${metrics.totalDocumentsNeverAccessed.value}`,
      textColor: "#EF4444",
    },
  ];
  return (
    <CardChart
      title="Indicadores dos Documentos"
      description="Métricas detalhadas dos documentos"
    >
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="flex flex-row justify-between items-center gap-3 rounded-lg border border-border bg-(image:--background-gradient) p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
                  <card.icon
                    className="size-5"
                    style={{ color: card.textColor }}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-semibold text-primary-text">
                  {card.title}
                </span>

                <span
                  className={`text-[.8rem] font-medium text-muted-foreground`}
                >
                  {card.details > 0 && "+"}
                  {card.details}% este período
                </span>
              </div>
            </div>
            <span className="text-lg font-bold text-primary-text">
              {card.quantity}
            </span>
          </Card>
        ))}
      </div>
    </CardChart>
  );
}