import { useEffect, useRef, useState } from "react";

export function useCommunicationPopup(communications: any[]) {
    const [active, setActive] = useState<any>(null);
    const hasOpened = useRef(false);

    useEffect(() => {
        if (!communications?.length) return;
        if (hasOpened.current) return; // 🔥 trava loop

        const unread = communications
            .filter(c => !c.read)
            .sort((a, b) => (b.priority === "HIGH" ? 1 : 0) - (a.priority === "HIGH" ? 1 : 0))[0];

        if (unread) {
            hasOpened.current = true;
            setActive(unread);
        }
    }, [communications]);

    const markAsRead = (id: string) => {
        setActive(null);
    };

    return {
        active,
        setActive,
        markAsRead
    };
}