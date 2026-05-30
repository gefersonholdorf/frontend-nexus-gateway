import { useQuery } from "@tanstack/react-query";
import {
    Cloud,
    CloudRain,
    MapPin,
    Sun,
} from "lucide-react";

import { Card } from "./ui/card";

function getWeatherDescription(code: number) {
    const map: Record<number, string> = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Nublado",
        61: "Chuva fraca",
        63: "Chuva moderada",
        65: "Chuva forte",
    };

    return map[code] || "Clima indefinido";
}

function getWeatherIcon(code: number) {
    if (code === 0) return Sun;

    if ([1, 2, 3].includes(code)) {
        return Cloud;
    }

    if ([61, 63, 65].includes(code)) {
        return CloudRain;
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
            <Card className="p-6">
                Carregando clima...
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

    const data = query.data;

    const MainIcon = getWeatherIcon(data.weatherCode);

    return (
        <Card className="h-55 rounded-2xl border  border-slate-200 px-4 py-4 shadow-sm flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg">
            <div className="flex items-start justify-between gap-1 pb-4">
                <div className="">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                        <MapPin className="size-4" />

                        <span className="text-sm">
                            {data.cidade}, SC
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900">
                        {data.temperatura}°C
                    </h1>

                    <p className="mt-1 text-[.9rem] text-slate-500">
                        {getWeatherDescription(
                            data.weatherCode
                        )}
                    </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-yellow-100 to-blue-100">
                    <MainIcon className="h-10 w-10 text-amber-500" />
                </div>
            </div>

            <div className="border-t px-4 pt-4">
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
                                <span className="text-[.7rem] text-slate-400">
                                    {item.hora}
                                </span>

                                <Icon className="size-5 text-slate-500" />

                                <span className="text-sm font-semibold text-slate-900">
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