import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";
import { Resource } from "@/app/types";
import PageTitle from "@/app/_ui_components/layout/PageTitle"
import FilteredResourceList from "./FilteredResourceList";

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data:resources}= await fetchJSONWithToken<Resource[]>(`${apiURL}/students/${id}/resources`);

    return (
        <>
            <PageTitle>Student Resources</PageTitle>
            
            <FilteredResourceList resources={resources || []} student_id={id} />

        </>
    )
}