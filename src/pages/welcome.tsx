import { BackupOverviewComponent } from "@/components/backup-overview";
import { EventsOverviewComponent } from "@/components/events-overview";
import { IncidentOverviewComponent } from "@/components/incident-overview";
import { SystemStatusCard } from "@/components/system-status-card";
import { WeatherCard } from "@/components/weather-card";
import { WelcomeCard } from "@/components/welcome-card";

export function WelcomePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 p-10 h-full">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <WelcomeCard />
                    </div>

                </div>
                <div className="lg:col-span-3 bg-white rounded-sm flex flex-col">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EventsOverviewComponent />
                        <BackupOverviewComponent />
                    </div>

                </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <WeatherCard />
                <IncidentOverviewComponent />
            </div>
            <SystemStatusCard serverName="SERVER - BRA - INFRA" serverId="10653" />
            <SystemStatusCard serverName="SERVER - BRA - APP" serverId="10654" />
            <SystemStatusCard serverName="SERVER - BRA - HOM" serverId="10656" />
        </div>
    )
}