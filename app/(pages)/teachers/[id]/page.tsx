import PageTitle from "@/app/ui/components/PageTitle";
import NewStudentButton from "../../../ui/components/NewStudentButton";
import StudentBrowser from "./StudentBrowser";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import { EnrolleeWithCurrentWeekPractice, User } from "@/app/types";
import { SecondaryLinkButton } from "@/app/ui/components/Buttons";

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;


            const {data: teacher} = await fetchJSONWithToken<User>(`${apiURL}/teachers/${id}`, 1800);

            const {data: students} = await fetchJSONWithToken<EnrolleeWithCurrentWeekPractice[]>(`${apiURL}/teachers/${id}/students`, 1800);
            if (!teacher) throw new Error("No teacher found")
                return (
                    <>
                        <PageTitle>Teacher Portal</PageTitle>
                        <p className="-mb-4">{teacher.name}</p>
                        <p className="text-zinc-400 mb-8"><em>{teacher.email}</em></p>
                        <div className="flex justify-evenly w-full flex-wrap gap-2">
                            <NewStudentButton teacher_id={id} />
                            <SecondaryLinkButton href={`/teachers/${id}/qr-codes`} className="text-center my-1">View All QR Codes</SecondaryLinkButton>
                        </div>
                        <StudentBrowser students={students || []} />
                    </>
                )


    

    
}