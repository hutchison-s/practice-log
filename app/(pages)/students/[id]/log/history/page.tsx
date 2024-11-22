import { logRow } from "@/app/types";
import LogDisplay from "@/app/ui/components/LogDisplay";
import PageTitle from "@/app/ui/components/PageTitle";



function PracticeTotal({logs}: {logs: logRow[]}) {
    
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
        <h3 className="font-bold text-xl">Total Practice Logged: {timeString}</h3>
    )
}

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data:logs, message}: {data: logRow[], message: string} = await (await fetch(`${apiURL}/students/${id}/logs`, { cache: "no-cache" })).json();
    return (
        <>
            <PageTitle>Log Practice</PageTitle>
            <p>{message}</p>
            <PracticeTotal logs={logs} />
            <div className="grid gap-2">
                {logs && logs.map((log) => {
                    return <LogDisplay log={log} key={log.log_id}/>
                })}
            </div>

        </>
    )
}