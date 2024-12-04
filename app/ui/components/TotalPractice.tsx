import { logRow } from "@/app/types";

export function TotalPractice({logs}: {logs: logRow[]}) {
    
    if (!logs || logs.length == 0) {
        return <h3 className="font-bold text-xl">No practice logged yet...</h3>
    }
    const totalSeconds = logs.reduce((sum, log) => sum + log.seconds, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remSeconds = totalSeconds % 60;
    let timeString = remSeconds+" seconds"
    if (totalMinutes > 0) {
        timeString = totalMinutes + " minutes and " + timeString; 
    }
    return (
        <div className="text-center">
            <h3 className="font-bold text-xl">Total Practice Logged</h3>
            <p className="text-md text-txtprimary">{timeString}</p>
        </div>
    )
}