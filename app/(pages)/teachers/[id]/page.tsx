import PageTitle from "@/app/ui/components/PageTitle";
import NewStudentButton from "./NewStudentButton";
import StudentBrowser from "./StudentBrowser";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import { EnrolleeWithCurrentWeekPractice, User } from "@/app/types";




export default async function Page({params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const {data: teacher} = await fetchJSONWithToken<User>(`${apiURL}/teachers/${id}`);
    const {data: students} = await fetchJSONWithToken<EnrolleeWithCurrentWeekPractice[]>(`${apiURL}/teachers/${id}/students`);

    if (!teacher) throw new Error("Could not locate teacher records.")
    return (
        <>
            <PageTitle>Teacher Portal</PageTitle>
            <p>{teacher.name}</p>
            <p className="text-txtsecondary"><em>{teacher.email}</em></p>
            <NewStudentButton teacher_id={id}/>
            <StudentBrowser students={students || []} />
        </>
    )
}