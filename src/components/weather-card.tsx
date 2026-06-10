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
        99: "Tempestade severa",
    };

    return map[code] ?? "Clima indefinido";
}

function getWeatherIcon(code: number) {
    if (code === 0) return Sun;

    if ([1, 2].includes(code)) {
        return CloudSun;
    }

    if ([3].includes(code)) {
        return Cloud;
    }

    if ([45, 48].includes(code)) {
        return CloudFog;
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return CloudDrizzle;
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return CloudRain;
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return CloudSnow;
    }

    if ([95, 96, 99].includes(code)) {
        return CloudLightning;
    }

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
                temperatura: Math.round(
                    weatherData.current.temperature_2m
                ),
                weatherCode:
                    weatherData.current.weather_code,

                proximasHoras: [
                    {
                        hora: "12h",
                        temp: Math.round(
                            weatherData.hourly.temperature_2m[0]
                        ),
                        code:
                            weatherData.hourly.weather_code[0],
                    },
                    {
                        hora: "15h",
                        temp: Math.round(
                            weatherData.hourly.temperature_2m[3]
                        ),
                        code:
                            weatherData.hourly.weather_code[3],
                    },
                    {
                        hora: "18h",
                        temp: Math.round(
                            weatherData.hourly.temperature_2m[6]
                        ),
                        code:
                            weatherData.hourly.weather_code[6],
                    },
                    {
                        hora: "21h",
                        temp: Math.round(
                            weatherData.hourly.temperature_2m[9]
                        ),
                        code:
                            weatherData.hourly.weather_code[9],
                    },
                ],
            };
        },
    });

    if (query.isLoading) {
        return (
            <Card className="h-55 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    const data = query.data;

    const MainIcon = getWeatherIcon(data.weatherCode);

    return (
        <Card className="h-55 bg-background rounded-2xl border border-border px-6 py-6 shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg">
            <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary-text">
                        <MapPin className="size-4" />
                        <span className="text-sm">
                            {data.cidade}, SC
                        </span>
                    </div>

                    <span className="rounded-full bg-background px-2 py-1 text-[.7rem] font-semibold uppercase text-primary-text">
                        Agora
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-text">
                            {data.temperatura}°C
                        </h1>

                        <p className="mt-1 text-[.9rem] text-primary-text">
                            {getWeatherDescription(data.weatherCode)}
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                        <MainIcon className="h-6 w-6 text-primary-text" />
                    </div>
                </div>
            </div>

            <div className="border-t px-4 pt-2">
                <div className="flex items-center justify-between">
                    {data.proximasHoras.map((item) => {
                        const Icon = getWeatherIcon(
                            item.code
                        );

                        return (
                            <div
                                key={item.hora}
                                className="flex flex-col items-center gap-1"
                            >
                                <span className="text-[.7rem] text-primary-text">
                                    {item.hora}
                                </span>

                                <Icon className="size-5 text-primary-text" />

                                <span className="text-sm font-semibold text-primary-text">
                                    {item.temp}°
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}