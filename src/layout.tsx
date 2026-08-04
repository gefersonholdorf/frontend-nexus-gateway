import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { websocket } from "./services/websocket";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        websocket.connect();

        return () => {
            websocket.disconnect();
        };
    }, []);
    return (
        <TooltipProvider>
            <>
                {children}
            </>
        </TooltipProvider>
    )
}