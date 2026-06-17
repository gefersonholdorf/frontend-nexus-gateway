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
    MapPin
} from "lucide-react";

import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

function getWeatherDescription(code: number) {
    const map: Record<number, string> = {
        0: "Céu limpo",
        1: "Poucas nuvens",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Nevoeiro",
        48: "Nevoeiro com geada",
        51: "Garoa fraca",
        53: "Garoa moderada",
        55: "Garoa intensa",
        61: "Chuva fraca",
        63: "Chuva moderada",
        65: "Chuva forte",
        66: "Chuva congelante",
        67: "Chuva congelante forte",
        71: "Neve fraca",
        73: "Neve moderada",
        75: "Neve forte",
        77: "Grãos de neve",
        80: "Pancadas de chuva",
        81: "Pancadas moderadas",
        82: "Pancadas intensas",
        85: "Pancadas de neve",
        86: "Neve intensa",
        95: "Tempestade",
        96: "Tempestade com granizo",
        99: "Tempestade severa"
    };

    return map[code] ?? "Clima indefinido";
}

function getWeatherIcon(code: number) {
    if (code === 0) return Sun;
    if ([1, 2].includes(code)) return CloudSun;
    if (code === 3) return Cloud;
    if ([45, 48].includes(code)) return CloudFog;
    if ([51, 53, 55, 56, 57].includes(code)) return CloudDrizzle;
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return CloudRain;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
    if ([95, 96, 99].includes(code)) return CloudLightning;
    return Cloud;
}

export function WeatherCard() {
    const query = useQuery({
        queryKey: ["weather"],
        queryFn: async () => {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=timbo&count=1&language=pt&format=json`
            );

            const geoData = await geoResponse.json();
            const location = geoData.results[0];

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=auto`
            );

            const weatherData = await weatherResponse.json();

            return {
                cidade: location.name,
                temperatura: Math.round(weatherData.current.temperature_2m),
                weatherCode: weatherData.current.weather_code
            };
        }
    });

    if (query.isLoading) {
        return (
            <Card className="h-40 rounded-3xl border border-border/50 p-4">
                <Skeleton className="h-full w-full rounded-2xl" />
            </Card>
        );
    }

    if (!query.data) return null;

    const data = query.data;
    const Icon = getWeatherIcon(data.weatherCode);

    return (
        <Card
            className="
                h-40
                relative
                overflow-hidden
                rounded-3xl
                border
                border-border/50
                bg-(image:--background-gradient)
                p-6
                shadow-lg
                transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg
            "
        >
            {/* glow atmosférico */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

            {/* HEADER */}
            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span className="text-sm font-medium">
                        {data.cidade}, SC
                    </span>
                </div>

                <span className="rounded-full bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                    Agora
                </span>
            </div>

            {/* MAIN */}
            <div className="relative flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight">
                        {data.temperatura}°C
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {getWeatherDescription(data.weatherCode)}
                    </p>
                </div>

                <div
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-border/50
                        bg-background/50
                        backdrop-blur
                    "
                >
                    <Icon className="size-7 text-primary" />
                </div>
            </div>
        </Card>
    );
}