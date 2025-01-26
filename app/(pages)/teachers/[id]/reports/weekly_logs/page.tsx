import React from 'react'
import { Metadata } from 'next'
import PageTitle from '@/app/_ui_components/layout/PageTitle';
import { fetchReport } from '../../actions';
import BodyText from '@/app/_ui_components/layout/BodyText';
import LogReportTable from '../../_components/LogReportTable';
import LogReportGraphs from '../../_components/LogReportGraphs';
import HoverLink from '@/app/_ui_components/menus/HoverLink';
import PrintButton from '@/app/_ui_components/PrintButton';

export const metadata: Metadata = {
    title: "Practice Reports",
    description: "Teachers can view actionable reports that help them identify student trends, weekly progress, and aid with grading practice logs.",
  };

const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

async function ReportsPage({params, searchParams}: {params: Promise<{id: string}>, searchParams: Promise<{view: string}>}) {
    const {id} = await params;
    const {view} = await searchParams;
    const studentRows = await fetchReport(id);
  return (
    <>
        <section className='no-print'>
          <PageTitle>Teacher Log Reports</PageTitle>
          <div className="w-full flex justify-center gap-4">
            <HoverLink href={`${siteURL}/teachers/${id}/reports/weekly_logs?view=table`} className={view == 'table' ? 'block px-3 border-b-2 border-b-teal-500 rounded-none' : 'block px-3'}>Table View</HoverLink>
            <HoverLink href={`${siteURL}/teachers/${id}/reports/weekly_logs?view=graph`} className={view == 'graph' ? 'block px-3 border-b-2 border-b-teal-500 rounded-none' : 'block px-3'}>Graph View</HoverLink>
            <PrintButton />
          </div>
        </section>
        {studentRows.length == 0 ? <BodyText>No data to report</BodyText>
          : <>
              {view == 'table' && <LogReportTable rows={studentRows} />}
              {view == 'graph' && <LogReportGraphs rows={studentRows} />}
            </>
        }
    </>
  )
}

export default ReportsPage