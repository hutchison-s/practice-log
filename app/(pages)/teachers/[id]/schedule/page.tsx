import React from 'react'
import WeekSchedule from './WeekSchedule';
import PageTitle from '@/app/_ui_components/layout/PageTitle';
import { Metadata } from 'next';
import { Teachers } from '@/app/api/_controllers/teacherController';

export const metadata: Metadata = {
    title: "Teacher Schedule",
    description: "Simple schedule layout for teachers to quickly view their weekly lessons schedule.",
  };

async function Calendar({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const students = await Teachers.getStudents(id);
    if (!students) return <></>
  return (
    <>
        <PageTitle>Teacher Schedule</PageTitle>
        <WeekSchedule studentList={students} />

    </>
  )
}

export default Calendar