import GoalsList from "@/app/_ui_components/object_display/GoalsList";
import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";
import { Goal } from "@/app/types";
import PageTitle from "@/app/_ui_components/layout/PageTitle";
import SubHeading from "@/app/_ui_components/layout/SubHeading";


export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data: goals} = await fetchJSONWithToken<Goal[]>(`${apiURL}/students/${id}/goals`);
    return (
        <>
            <PageTitle>Student Goals</PageTitle>
            <SubHeading>Active</SubHeading>
            <GoalsList goals={goals?.filter(g => !g.is_complete) || []} isStudentView/>
            <SubHeading>Completed</SubHeading>
            <GoalsList goals={goals?.filter(g => g.is_complete) || []} isStudentView/>
        </>
    )
}