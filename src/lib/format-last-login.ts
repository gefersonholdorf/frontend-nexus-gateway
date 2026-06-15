import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatLastLogin(dateString: string) {
    const date = new Date(dateString);

    if (isToday(date)) {
        return `Hoje, às ${format(date, "HH:mm")}`;
    }

    if (isYesterday(date)) {
        return `Ontem, às ${format(date, "HH:mm")}`;
    }

    return format(
        date,
        "dd 'de' MMMM, yyyy 'às' HH:mm",
        { locale: ptBR }
    );
}