import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // useEffect(() => {
    //     websocket.connect();

    //     return () => {
    //         websocket.disconnect();
    //     };
    // }, []);
    return (
        <TooltipProvider>
            <>
                {children}
            </>
        </TooltipProvider>
    )
}