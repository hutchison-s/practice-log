'use server'

import { getReport } from '@/app/_utils/emails/queries';
import { StudentWeekReport } from '@/app/types'
import { monthsAbrev } from '../dates';

type teacherInfo = {id: string, name: string, email: string}
const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

async function WeeklyTeacherReport(teacher: teacherInfo) {

    const reports = await getReport(teacher.id);

    const weekEnd = (start: string) => {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${monthsAbrev[end.getMonth()] } ${end.getDate()}, ${end.getFullYear()}`
    }

    function ReportHTML(report: StudentWeekReport) {
        const group_name = report.group ?? 'No Group';
        const bgColor = report.color ?? 'none'
        return (
            `<tr style="padding: 0.2rem; border: 1px solid black;">
                <td style="padding: 0.25rem 0.5rem;">${report.name}</td>
                <td style="padding: 0.25rem 0.5rem; background-color: ${bgColor}; color: ${group_name !== 'No Group' ? 'white' : 'black'}">${group_name}</td>
                <td style="padding: 0.25rem 0.5rem; min-width: 60px; text-align: center;">${report.goal}</td>
                <td style="padding: 0.25rem 0.5rem; min-width: 60px; text-align: center;">${report.mins}</td>
                <td style="padding: 0.25rem 0.5rem; min-width: 60px; text-align: center;">${report.grade}%</td>
            </tr>`
        )
    }

  return (
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Weekly Report</title>
    </head>
    <body>
        <h1>${teacher.name}&apos;s Weekly Practice Report</h1>
        <p><small>Practice HQ - The essential platform for connecting music lessons and student practice to drive measurable growth.</small></p>
        
        ${reports.length > 0 
            ?   `<p>Week starting ${reports[0].week} and ending ${weekEnd(reports[0].week)}</p>
                <table style="border: 1px solid black; border-radius: 0.5rem; padding: 0.5rem;">
                    <tr style="background-color: #1e293b; font-size: 1.06rem; color: white;">
                        <th>Name</th>
                        <th>Group</th>
                        <th>Goal</th>
                        <th>Practiced</th>
                        <th>Percent</th>
                    </tr>
                    ${reports.map((s, i) => ReportHTML(reports[i])).join(' ')}
                </table>`
            : `<p>No data to report yet.</p>`}
       ${reports.length > 0 
            ? `<a style="margin-top: 1rem; font-size: 1.1rem; display: block;" href="${siteURL}/teachers/${teacher.id}/reports/weekly_logs?view=table">Check out more detailed reports on the Reports Page at Practice HQ</a>`
            : `<a style="margin-top: 1rem; font-size: 1.1rem; display: block;" href="${siteURL}/teachers/${teacher.id}">Get started by creating some student profiles!</a>`
       }
       <p style="margin-top: 1rem;"><small>Change your notification settings any time by signing in and clicking your initial in the page header to edit account setings.</small></p>
    </body>
    </html>`
  )
}

export default WeeklyTeacherReport