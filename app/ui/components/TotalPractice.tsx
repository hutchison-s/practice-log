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
        <div className="w-full rounded-xl p-4 border-[1px] border-white/25 text-center bg-gradient-to-br from-indigo-800/75 to-indigo-950/75 backdrop-blur">
            <h3 className="font-bold text-xl text-white text-shadow-xl">Total Practice Logged</h3>
            <p className="text-lg text-zinc-400 font-inter font-light">{timeString}</p>
        </div>
    )
}