import { fetchJSONWithToken } from '@/app/AuthHandler'
import { EnrolleeWithCurrentWeekPractice } from '@/app/types'
import React from 'react'
import WeekSchedule from './WeekSchedule';
import PageTitle from '@/app/ui/components/PageTitle';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Teacher Schedule",
    description: "Simple schedule layout for teachers to quickly view their weekly lessons schedule.",
  };

async function Calendar({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    const {id} = await params;
    const {data: students} = await fetchJSONWithToken<EnrolleeWithCurrentWeekPractice[]>(`${apiURL}/teachers/${id}/students`)
    if (!students) return <></>
  return (
    <>
        <PageTitle>Teacher Schedule</PageTitle>
        <WeekSchedule studentList={students} />

    </>
  )
}

export default Calendar