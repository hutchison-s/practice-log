export function utcToTimeZone(utcTimestamp: string, format='day, month, date, year, hour, minute'): string {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Formatting', utcTimestamp)

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

export function utcToDateInput(utcTimestamp: string) {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Formatting', utcTimestamp)

    const utcDate = new Date(utcTimestamp);

    const inputDateFormat = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'numeric', 
        day: 'numeric', 
        timeZone: userTimezone, // Use the detected timezone
    }).format(utcDate);

    return inputDateFormat
}

export function simpleTimeString(time: string) {
    const [h, m] = time.split(':');
    const date = new Date('2025-01-01');
    date.setHours(parseInt(h));
    date.setMinutes(parseInt(m))
    return date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true});
  }

export function timeInputToISOTime(time: string) {
    return `${time}:00+00`
}