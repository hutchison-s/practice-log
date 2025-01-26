export function utcToTimeZone(utcTimestamp: string, format='day, month, date, year, hour, minute'): string {
    // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
        // timeZone: userTimezone, // Use the detected timezone
    }).format(utcDate);

    return localDateString
}

export function timestampWithLocalTimezone() {
    'use client'
    const date = new Date();

    // Format the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Get timezone offset in minutes and convert to hours and minutes
    const offset = date.getTimezoneOffset(); // in minutes
    const absOffset = Math.abs(offset);
    const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
    const offsetMinutes = String(absOffset % 60).padStart(2, '0');
    const offsetSign = offset <= 0 ? '+' : '-';

    // Construct the timestamp
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

export function utcToDateInput(utcTimestamp: string) {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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

export function parse12HourTime(timeString: string) {
    const [timePart, period] = timeString.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
  
    let hours24 = hours;
    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours24 += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours24 = 0;
    }
  
    return new Date(0, 0, 0, hours24, minutes);
  }

  export function parseDateString(dateString: string) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [m, d, y] = dateString.replace(',', '').split(/[\s]/gi);
    console.log(m, d, y)
    return new Date(parseInt(y), months.indexOf(m), parseInt(d), 0, 0, 0);
  }