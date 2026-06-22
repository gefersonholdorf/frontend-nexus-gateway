import { AnnouncementsComponent } from "@/components/announcements-component";
import { EventsWaitingConfirm } from "@/components/calendar/events-waiting-confirm";
import { NextEventsDetails } from "@/components/calendar/next-events-details";
import { NextEvents } from "@/components/calendar/next-events-summary";
import { GLPISummaryComponent } from "@/components/glpi-summary-component";
import { QuickAccessComponent } from "@/components/quick-access-component";
import { QuickAccessSupportComponent } from "@/components/quick-access-support-component";
import { VPNStatusCard } from "@/components/vpn-status-component";
import { WelcomeCard } from "@/components/welcome-card";

export function WelcomePage() {
    return (
        <div className="flex flex-col gap-6 p-4 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <WelcomeCard />
                </div>
                <div className="lg:col-span-2">
                    <QuickAccessSupportComponent />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <GLPISummaryComponent />
                <VPNStatusCard />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <QuickAccessComponent />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                    <NextEventsDetails />
                </div>
                <div className="col-span-1">
                    <NextEvents />
                </div>
            </div>
            <EventsWaitingConfirm />

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <AnnouncementsComponent />
            </div>
        </div>
    )
}