import { AnnouncementsComponent } from "@/components/announcements-component";
import { EventsOverviewComponent } from "@/components/events-overview";
import { WeatherCard } from "@/components/weather-card";
import { WelcomeCard } from "@/components/welcome-card";

export function WelcomePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 p-10 w-full h-full">
            <div className="lg:col-span-2">
                <WelcomeCard />
            </div>
            <div className="lg:col-span-1">
                <WeatherCard />
            </div>
            <div className="col-span-3 grid grid-cols-4 gap-6">
                <div className="col-span-2">
                    <EventsOverviewComponent />
                </div>
                <div className="col-span-2">
                    <AnnouncementsComponent />
                </div>
            </div>
        </div>
    )
}