import { fetchJSONWithToken } from "@/app/AuthHandler";
import { Enrollee, Resource } from "@/app/types";
import PageTitle from "@/app/ui/components/PageTitle"
import StudentResourceDisplay from "@/app/ui/components/StudentResourceDisplay";

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data:student, message} = await fetchJSONWithToken<Enrollee>(`${apiURL}/students/${id}`);
    console.log(student, message)
    if (!student) throw new Error('This student does not exist')
    const {data:resources}: {data: Resource[]} = await (await fetch(`${apiURL}/students/${id}/resources`)).json();
    return (
        <>
            <PageTitle>Resources</PageTitle>
            <p>{student.name}</p>
            <div className="grid gap-2">
                {resources && resources.map((r) => {
                    return <StudentResourceDisplay r={r} key={r.id}/>
                })}
            </div>

        </>
    )
}