import { fetchJSONWithToken } from "@/app/AuthHandler";
import { logRow } from "@/app/types";
import PageTitle from "@/app/ui/components/PageTitle";
import PracticeLogList from "@/app/ui/components/PracticeLogList";
import { TotalPractice } from "@/app/ui/components/TotalPractice";


export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data: logs} = await fetchJSONWithToken<logRow[]>(`${apiURL}/students/${id}/logs`);
    return (
        <>
            <PageTitle>Student Practice Logs</PageTitle>
            <TotalPractice logs={logs || []} />
            <PracticeLogList logs={logs || []} />

        </>
    )
}