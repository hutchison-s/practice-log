import PageTitle from "@/app/ui/components/PageTitle";
import NewStudentButton from "../../../ui/components/NewStudentButton";
import StudentBrowser from "./StudentBrowser";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import { EnrolleeWithCurrentWeekPractice, User } from "@/app/types";
import { SecondaryLinkButton } from "@/app/ui/components/Buttons";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teacher Portal",
    description: "Teacher dashboard for lessons studio management. Create goals, share resources, and track progress for each student with ease.",
  };

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
                        <div className="flex w-full justify-center mt-8 p-2 gap-4 flex-wrap md:flex-nowrap">
                            <SecondaryLinkButton href="/password-reset" size="sm">Change Password</SecondaryLinkButton>
                            <SecondaryLinkButton href={`/teachers/${id}/delete-account`} size="sm" className="hover:bg-red-900 hover:border-white">Delete My Account</SecondaryLinkButton>
                        </div>
                    </>
                )


    

    
}