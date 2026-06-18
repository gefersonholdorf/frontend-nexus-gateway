import { AnnouncementsComponent } from "@/components/announcements-component";
import { CalendarOverviewComponent } from "@/components/calendar-overview-component";
import { GLPISummaryComponent } from "@/components/glpi-summary-component";
import { QuickAccessComponent } from "@/components/quick-access-component";
import { QuickAccessSupportComponent } from "@/components/quick-access-support-component";
import { VPNStatusCard } from "@/components/vpn-status-component";
import { WelcomeCard } from "@/components/welcome-card";

export function WelcomePage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WelcomeCard />
                    <GLPISummaryComponent />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <QuickAccessSupportComponent />
                    <VPNStatusCard isConnected />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CalendarOverviewComponent />
                <AnnouncementsComponent />
            </div>

            <div>
                <QuickAccessComponent />
            </div>

        </div>
    )
}