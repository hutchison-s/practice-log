import PageTitle from "@/app/ui/components/PageTitle";
import NewStudentButton from "./NewStudentButton";
import StudentBrowser from "./StudentBrowser";
import { fetchJSONWithToken } from "@/app/AuthHandler";


const apiURL = process.env.NEXT_PUBLIC_API_URL_BASE;

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
    const teacher = await fetchJSONWithToken(`${apiURL}/teachers/${id}`);
    const students = await fetchJSONWithToken(`${apiURL}/teachers/${id}/students`);

    return (
        <>
            <PageTitle>Teacher Portal</PageTitle>
            <p>{teacher.name}</p>
            <p className="text-txtsecondary"><em>{teacher.email}</em></p>
            <NewStudentButton teacher_id={id}/>
            <StudentBrowser students={students.students} />
        </>
    )
}