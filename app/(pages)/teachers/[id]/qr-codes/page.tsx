import { fetchJSONWithToken } from '@/app/AuthHandler';
import { EnrolleeWithCurrentWeekPractice, Group } from '@/app/types';
import PageTitle from '@/app/ui/components/PageTitle';
import PrintButton from '@/app/ui/components/PrintButton';

import React from 'react'
import FilteredQRCodes from './FilteredQRCodes';



async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const students = await fetchJSONWithToken<EnrolleeWithCurrentWeekPractice[]>(`${apiURL}/teachers/${id}/students`);
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