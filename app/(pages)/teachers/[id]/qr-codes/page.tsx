import { fetchJSONWithToken } from '@/app/_utils/AuthHandler';
import { Enrollee, Group } from '@/app/types';
import PageTitle from '@/app/_ui_components/layout/PageTitle';
import PrintButton from '@/app/_ui_components/PrintButton';

import React from 'react'
import FilteredQRCodes from './FilteredQRCodes';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "QR Codes",
  description: "View, download, and print QR codes for all your students in one place. Filter by group or print all at once.",
};



async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const students = await fetchJSONWithToken<Enrollee[]>(`${apiURL}/teachers/${id}/students`);
    const groups = await fetchJSONWithToken<Group[]>(`${apiURL}/teachers/${id}/groups`);
  return (
    <>
    <div className="no-print">
        <PageTitle>Student QR Codes</PageTitle>
    </div>
    <div className="w-full flex justify-center print:hidden">
        <PrintButton/>
    </div>
    <FilteredQRCodes groups={groups.data || []} students={students.data || []} />   
    </>
  )
}

export default Page