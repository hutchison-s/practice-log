export function utcToTimeZone(utcTimestamp: string, format='day, month, date, year, hour, minute'): string {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const utcDate = new Date(utcTimestamp);

    const localDateString = new Intl.DateTimeFormat('en-US', {
        weekday: format.includes('day') ? 'short' : undefined, // "Mon"
        year: format.includes('year') ? 'numeric' : undefined, // "2024"
        month: format.includes('month') ? 'short' : undefined, // "Nov"
        day: format.includes('date') ? 'numeric' : undefined, // "20"
        hour: format.includes('hour') ? 'numeric' : undefined, // "12"
        minute: format.includes('minute') ? 'numeric' : undefined, // "30"
        second: format.includes('second') ? 'numeric' : undefined, // "15"
        timeZoneName: format.includes('timezone') ? 'short' : undefined, // "PST"
        timeZone: userTimezone, // Use the detected timezone
    }).format(utcDate);

    return localDateString
}