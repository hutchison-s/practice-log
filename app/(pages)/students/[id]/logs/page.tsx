import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";
import { Enrollee, logRow, weeklyTotal } from "@/app/types";
import PageTitle from "@/app/_ui_components/layout/PageTitle";
import FilteredLogList from "./FilteredLogList";
import FeaturedText from "@/app/_ui_components/layout/FeaturedText";



export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data: student} = await fetchJSONWithToken<Enrollee>(`${apiURL}/students/${id}`);
    const {data: logs} = await fetchJSONWithToken<logRow[]>(`${apiURL}/students/${id}/logs`);
    const {data: weeks} = await fetchJSONWithToken<weeklyTotal[]>(`${apiURL}/students/${id}/logs/week_total`);
    console.log(weeks)
    return (
        <>
            <PageTitle>Student Practice Logs</PageTitle>
            <FeaturedText>{student?.name}&apos;s {student?.subject} lessons</FeaturedText>
            
            <FilteredLogList weekly_goal={student?.weekly_goal || 0} weeks={weeks || []} logs={logs || []} />

            
        </>
    )
}