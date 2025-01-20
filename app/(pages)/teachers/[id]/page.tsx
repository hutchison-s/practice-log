import PageTitle from "@/app/_ui_components/layout/PageTitle";
import StudentBrowser from "./_components/StudentBrowser";
import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";
import { Enrollee, Group, User } from "@/app/types";
import { SecondaryLinkButton } from "@/app/_ui_components/layout/Buttons";
import { Metadata } from "next";
import NotificationAlert from "./_components/NotificationAlert";

export const metadata: Metadata = {
    title: "Teacher Portal",
    description: "Teacher dashboard for lessons studio management. Create goals, share resources, and track progress for each student with ease.",
  };

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const {data: teacher} = await fetchJSONWithToken<User>(`${apiURL}/teachers/${id}`, 3600);
    const {data: students} = await fetchJSONWithToken<Enrollee[]>(`${apiURL}/teachers/${id}/students`, 3600);
    const {data: groups} = await fetchJSONWithToken<Group[]>(`${apiURL}/teachers/${id}/groups`, 3600);


    if (!teacher) throw new Error("No teacher found")
        return (
            <>
                <PageTitle>Teacher Portal</PageTitle>
                <p className="-mb-4">{teacher.name}</p>
                <p className="text-zinc-400 mb-8"><em>{teacher.email}</em></p>
                <NotificationAlert teacher_id={id}/>
                <StudentBrowser students={students || []} groups={groups || []} teacher_id={id}/>
                <div className="flex w-full justify-center mt-8 p-2 gap-4 flex-wrap md:flex-nowrap">
                    <SecondaryLinkButton href="/password-reset" size="sm">Change Password</SecondaryLinkButton>
                    <SecondaryLinkButton href={`/teachers/${id}/delete-account`} size="sm" className="hover:bg-red-900 hover:border-white">Delete My Account</SecondaryLinkButton>
                </div>
            </>
        )


    

    
}