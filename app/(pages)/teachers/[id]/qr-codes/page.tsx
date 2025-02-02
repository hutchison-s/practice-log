import PageTitle from '@/app/_ui_components/layout/PageTitle';
import PrintButton from '@/app/_ui_components/PrintButton';

import React from 'react'
import FilteredQRCodes from './FilteredQRCodes';
import { Metadata } from 'next';
import { Teachers } from '@/app/api/_controllers/teacherController';

export const metadata: Metadata = {
  title: "QR Codes",
  description: "View, download, and print QR codes for all your students in one place. Filter by group or print all at once.",
};

async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const students = await Teachers.getStudents(id);
    const groups = await Teachers.getAllGroups(id);
  return (
    <>
    <div className="no-print">
        <PageTitle>Student QR Codes</PageTitle>
    </div>
    <div className="w-full flex justify-center print:hidden">
        <PrintButton/>
    </div>
    <FilteredQRCodes groups={groups || []} students={students || []} />   
    </>
  )
}

export default Page