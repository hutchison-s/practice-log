import { SecondaryLinkButton } from '@/app/_ui_components/layout/Buttons';
import FeaturedText from '@/app/_ui_components/layout/FeaturedText';
import GlassDiv from '@/app/_ui_components/layout/GlassDiv';
import PageTitle from '@/app/_ui_components/layout/PageTitle';
import { utcToTimeZone } from '@/app/_utils/dates';
import React from 'react'
import NotificationOptions from './NotificationOptions';
import SubHeading from '@/app/_ui_components/layout/SubHeading';
import { Metadata } from 'next';
import { TeacherModel } from '@/app/api/_controllers/teacherController';

export const metadata: Metadata = {
    title: "Account Settings",
    description: "Manage your notification settings and account information.",
  };

async function AccountPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const teacher = await TeacherModel(id);
    const settings = await teacher.getPreferences();
  return (
    <>
        <PageTitle>Account Settings</PageTitle>
        <FeaturedText>{teacher.name}</FeaturedText>
        <div className="flex w-full justify-center mt-8 p-2 gap-4 flex-wrap md:flex-nowrap">
            <SecondaryLinkButton href="/password-reset" size="sm">Change Password</SecondaryLinkButton>
        </div>
        <GlassDiv className='p-4 rounded-xl my-4'>
            <table className='mx-auto gap-2 w-fit font-inter md:text-xl'>
                <thead></thead>
                <tbody>
                    <tr className='my-4 grid gap-2 w-full md:grid-cols-[150px_1fr]'>
                        <td className='md:text-right'><strong>Email:</strong></td>
                        <td className='font-light text-txtprimary'>{teacher.email}</td>
                    </tr>
                    <tr className='my-4 grid gap-2 w-full md:grid-cols-[150px_1fr]'>
                        <td className='md:text-right'><strong>Joined:</strong></td>
                        <td className='font-light text-txtprimary'>{utcToTimeZone(teacher.created_at)}</td>
                    </tr>
                    <tr className='my-4 grid gap-2 w-full md:grid-cols-[150px_1fr]'>
                        <td className='md:text-right'><strong>Time Zone:</strong></td>
                        <td className='font-light text-txtprimary'>{teacher.timezone}</td>
                    </tr>
                </tbody>
            </table>
            <SubHeading className='text-center mt-8'>Notification Settings</SubHeading>
            <NotificationOptions teacher_id={id} userSettings={settings}/>
        </GlassDiv>
        <div className="flex w-full justify-center mt-8 p-2 gap-4 flex-wrap md:flex-nowrap">
            <SecondaryLinkButton href={`/teachers/${id}/delete-account`} size="sm" className="hover:bg-red-950 hover:border-red-500">Delete My Account</SecondaryLinkButton>
        </div>
    </>
  )
}

export default AccountPage