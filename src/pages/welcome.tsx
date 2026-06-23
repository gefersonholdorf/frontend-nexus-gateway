import { AvailabilityComponent } from "@/components/calendar/availability-component";
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
                    <GLPISummaryComponent />
                    <div className="grid grid-cols-2 gap-6">
                        <NextEvents />
                        <QuickAccessSupportComponent />
                    </div>
                    <NextEventsDetails />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <AvailabilityComponent />
                    <VPNStatusCard />
                    <EventsWaitingConfirm />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <QuickAccessComponent />
            </div>
            {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <AnnouncementsComponent />
            </div> */}
        </div>
    )
}