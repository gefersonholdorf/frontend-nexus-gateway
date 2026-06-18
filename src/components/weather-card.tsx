import { useQuery } from "@tanstack/react-query";
import {
    Sun,
    Cloud,
    CloudSun,
    CloudRain,
    CloudDrizzle,
    CloudFog,
    CloudSnow,
    CloudLightning,
    MapPin,
} from "lucide-react";

import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const weatherMap = {
    0: { label: "Céu limpo", icon: Sun },
    1: { label: "Poucas nuvens", icon: CloudSun },
    2: { label: "Parcialmente nublado", icon: CloudSun },
    3: { label: "Nublado", icon: Cloud },
    45: { label: "Nevoeiro", icon: CloudFog },
    48: { label: "Nevoeiro", icon: CloudFog },
    51: { label: "Garoa", icon: CloudDrizzle },
    53: { label: "Garoa", icon: CloudDrizzle },
    55: { label: "Garoa", icon: CloudDrizzle },
    61: { label: "Chuva", icon: CloudRain },
    63: { label: "Chuva", icon: CloudRain },
    65: { label: "Chuva forte", icon: CloudRain },
    71: { label: "Neve", icon: CloudSnow },
    73: { label: "Neve", icon: CloudSnow },
    75: { label: "Neve", icon: CloudSnow },
    95: { label: "Tempestade", icon: CloudLightning },
    96: { label: "Tempestade", icon: CloudLightning },
    99: { label: "Tempestade", icon: CloudLightning },
} as const;

export function WeatherCard() {
    const { data, isLoading } = useQuery({
        queryKey: ["weather"],
        queryFn: async () => {
            const geo = await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name=timbo&count=1"
            ).then((r) => r.json());

            const city = geo.results?.[0];

            const weather = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=-26.8156195&longitude=-49.2798854&current=temperature_2m,weather_code`
            ).then((r) => r.json());

            return {
                city: city.name,
                temperature: Math.round(weather.current.temperature_2m),
                code: weather.current.weather_code,
            };
        },
        staleTime: 1000 * 60 * 30,
    });

    if (isLoading) {
        return (
            <Card className="h-30 rounded-sm">
                <Skeleton className="h-full w-full rounded-sm" />
            </Card>
        );
    }

    if (!data) return null;

    const weather =
        weatherMap[data.code as keyof typeof weatherMap] ?? {
            label: "Indefinido",
            icon: Cloud,
        };

    const Icon = weather.icon;

    return (
        <Card className="h-30 rounded-sm p-4 border-none border-transparent shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-lg outline-none">
            <div className="flex h-full items-center justify-between">
                <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {data.city}, SC
                    </div>

                    <h2 className="mt-2 text-3xl font-bold">
                        {data.temperature}°
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {weather.label}
                    </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <Icon className="size-7" />
                </div>
            </div>
        </Card>
    );
}