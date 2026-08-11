import { differenceInSeconds } from "date-fns";

export interface SLAResult {
    title: "Atendimento" | "Resolução";
    label: string;
    percentageValue: number
    percentage: number;
    color: "green" | "yellow" | "orange" | "red";
    expired: boolean;
    completed: boolean;
}

interface Props {
    type: "Atendimento" | "Resolução";
    startDate: string | Date;
    dueDate: string | Date | null;
    started?: boolean;
    completedDate?: string | Date | null;
    paused?: boolean;
}

export function calculateSLA({
    type,
    startDate,
    dueDate,
    completedDate,
    paused
}: Props): SLAResult {

    if (!dueDate) {
        return {
            title: type,
            label: "---",
            percentageValue: 0,
            percentage: 0,
            color: "green",
            expired: false,
            completed: false,
        };
    }

    if (paused) {
        return {
            title: type,
            label: "SLA Pausado",
            percentageValue: 0,
            percentage: 100,
            color: "yellow",
            expired: false,
            completed: false,
        };
    }

    if (type === "Resolução" && !startDate) {
        return {
            title: type,
            label: "Falta iniciar atendimento",
            percentageValue: 0,
            percentage: 0,
            color: "yellow",
            expired: false,
            completed: false,
        };
    }

    const start = new Date(startDate).getTime();
    const end = new Date(dueDate).getTime();

    const compareDate = completedDate
        ? new Date(completedDate).getTime()
        : Date.now();

    const completed = !!completedDate;
    const completedLate = completed && compareDate > end;

    if (completedLate) {
        return {
            title: type,
            label: "Concluído fora do SLA",
            percentageValue: 0,
            percentage: 100,
            color: "red",
            expired: true,
            completed: true,
        };
    }

    const totalDuration = end - start;
    const remaining = end - compareDate;

    if (remaining <= 0 && !completedDate) {
        return {
            title: type,
            label: "Expirado",
            percentageValue: 0,
            percentage: 100,
            color: "red",
            expired: true,
            completed: false,
        };
    }

    const remainingSeconds = Math.max(
        0,
        differenceInSeconds(
            new Date(end),
            new Date(compareDate)
        )
    );

    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);

    let remainingText = "";

    if (days > 0) {
        remainingText = `${days}d ${hours}h`;
    } else if (hours > 0) {
        remainingText = `${hours}h ${minutes}min`;
    } else {
        remainingText = `${minutes}min`;
    }

    let percentage = 0;

    if (totalDuration > 0) {
        percentage = Math.round(
            (Math.max(remaining, 0) / totalDuration) * 100
        );

        percentage = Math.min(100, Math.max(0, percentage));
    }

    let color: SLAResult["color"];

    if (percentage > 50)
        color = "green";
    else if (percentage > 25)
        color = "yellow";
    else if (percentage > 10)
        color = "orange";
    else
        color = "red";

    return {
        title: type,
        label: completedDate
            ? `Concluído`
            : `${remainingText} restantes`,
        percentageValue: percentage,
        percentage,
        color: completedDate ? "green" : color,
        expired: false,
        completed: !!completedDate,
    };
}