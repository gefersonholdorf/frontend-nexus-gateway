export function formatEventDate(start: Date, end: Date) {
    const date = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
    }).format(start)

    const startTime = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(start)

    const endTime = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(end)

    return `${startTime} - ${endTime}`
}