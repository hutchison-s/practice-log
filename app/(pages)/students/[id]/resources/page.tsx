import ResourceList from "@/app/(pages)/teachers/[id]/ResourceList";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import { Resource } from "@/app/types";
import PageTitle from "@/app/ui/components/PageTitle"

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data:resources}= await fetchJSONWithToken<Resource[]>(`${apiURL}/students/${id}/resources`);
    return (
        <>
            <PageTitle>Student Resources</PageTitle>
            <ResourceList resources={resources} isStudentView />

        </>
    )
}