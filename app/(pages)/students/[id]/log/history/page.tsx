import { logRow } from "@/app/types";
import LogDisplay from "@/app/ui/components/LogDisplay";
import PageTitle from "@/app/ui/components/PageTitle";
import { TotalPractice } from "@/app/ui/components/TotalPractice";


export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data:logs, message}: {data: logRow[], message: string} = await (await fetch(`${apiURL}/students/${id}/logs`, { cache: "no-cache" })).json();
    return (
        <>
            <PageTitle>Log Practice</PageTitle>
            <p>{message}</p>
            <TotalPractice logs={logs} />
            <div className="grid gap-2">
                {logs && logs.map((log) => {
                    return <LogDisplay log={log} key={log.log_id}/>
                })}
            </div>

        </>
    )
}