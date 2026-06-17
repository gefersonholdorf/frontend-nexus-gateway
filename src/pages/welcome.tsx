import { AnnouncementsComponent } from "@/components/announcements-component";
import { EventsOverviewComponent } from "@/components/events-overview";
import { QuickAccessComponent } from "@/components/quick-access-component";
import { QuickAccessSupportComponent } from "@/components/quick-access-support-component";
import { WelcomeCard } from "@/components/welcome-card";

export function WelcomePage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-10">

            {/* Topo principal */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                    <WelcomeCard />
                </div>
                <div className="lg:col-span-2">
                    <QuickAccessSupportComponent />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventsOverviewComponent />
                <AnnouncementsComponent />
            </div>

            <div>
                <QuickAccessComponent />
            </div>

        </div>
    )
}