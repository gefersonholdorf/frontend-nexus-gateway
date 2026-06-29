import { AvailabilityComponent } from "@/components/calendar/availability-component";
import { NextEvents } from "@/components/calendar/next-events-summary";
import { GLPISummaryComponent } from "@/components/glpi-summary-component";
import { SummaryUserJira } from "@/components/jira/summary-user-jira";
import { QuickAccessComponent } from "@/components/quick-access-component";
import { QuickAccessSupportComponent } from "@/components/quick-access-support-component";
import { VPNStatusCard } from "@/components/vpn-status-component";
import { WelcomeCard } from "@/components/welcome-card";

export function WelcomePage() {
    return (
        <div className="flex flex-col p-4 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <WelcomeCard />
                    <div className="w-full grid grid-cols-5 gap-6">
                        <div className="col-span-3 space-y-6">
                            <SummaryUserJira />
                            <GLPISummaryComponent />
                        </div>
                        <div className="col-span-2 space-y-6">
                            <NextEvents />
                            <QuickAccessSupportComponent />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <VPNStatusCard />
                    <AvailabilityComponent />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                <QuickAccessComponent />
            </div>
        </div>
    )
}