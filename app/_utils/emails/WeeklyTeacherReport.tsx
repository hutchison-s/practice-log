'use server'

import { Students } from '@/app/api/_controllers/studentController'
import { Teachers } from '@/app/api/_controllers/teacherController'
import { Enrollee, weeklyTotal } from '@/app/types'
import { sql } from '@vercel/postgres';

type teacherInfo = {id: string, name: string, email: string}
const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

async function WeeklyTeacherReport(teacher: teacherInfo) {
    const {rows: students} = await sql<{id: string, name: string, subject: string, weekly_goal: number, group_id: number, group_color: string, group_name: string}>`
    SELECT 
        s.id, 
        s.name, 
        s.subject, 
        s.weekly_goal,
        s.group_id,
        g.color as group_color,
        g.name as group_name
    FROM 
        students AS s
    LEFT JOIN
        groups AS g ON g.id = s.group_id
    WHERE 
        s.teacher_id = ${teacher.id}
    `;

    const reportPromises = [];
    for (let i = 0; i < students.length; i++) {
        reportPromises.push(sql<weeklyTotal>`SELECT
              DATE_TRUNC('DAY', CURRENT_TIMESTAMP AT TIME ZONE s.timezone) - (INTERVAL '1 day' * (((EXTRACT(DOW from CURRENT_TIMESTAMP AT TIME ZONE s.timezone) + 7) - s.day_of_week) % 7)) as lesson_week_start,
              l.student_id,
              s.weekly_goal,
              sum(l.total_time) AS weekly_total
            FROM
              logs AS l
            LEFT JOIN
              students AS s ON l.student_id = s.id
            WHERE
              l.student_id = ${students[i].id} AND l.start_time AT TIME ZONE s.timezone >= DATE_TRUNC('DAY', CURRENT_TIMESTAMP AT TIME ZONE s.timezone) - (INTERVAL '1 day' * (((EXTRACT(DOW from CURRENT_TIMESTAMP AT TIME ZONE s.timezone) + 7) - s.day_of_week) % 7))
            GROUP BY
              lesson_week_start, l.student_id, s.weekly_goal;
            `)
    }
    const reports = (await Promise.all(reportPromises)).map(rep => rep.rows[0]);
    function ReportHTML(report: weeklyTotal | null, student: {id: string, name: string, subject: string, weekly_goal: number, group_id: number, group_color: string, group_name: string}) {
        const mins = report ? Math.floor(parseInt(report.weekly_total) / 60) : 0;
        const percent = report ? Math.round((mins / student.weekly_goal) * 100) : 0
        const group_name = student.group_id ? student.group_name : 'No Group';
        const bgColor = student.group_id ? student.group_color : 'none'
        return (
            `<tr style="padding: 0.2rem; border: 1px solid black;">
                <td style="padding: 0.25rem 0.5rem;">${student.name}</td>
                <td style="padding: 0.25rem 0.5rem; background-color: ${bgColor}; color: ${group_name !== 'No Group' ? 'white' : 'black'}">${group_name}</td>
                <td style="padding: 0.25rem 0.5rem; min-width: 60px; text-align: center;">${student.weekly_goal}</td>
                <td style="padding: 0.25rem 0.5rem; min-width: 60px; text-align: center;">${mins}</td>
                <td style="padding: 0.25rem 0.5rem; min-width: 60px; text-align: center;">${percent}%</td>
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
        ${students.length > 0 
            ?   `<table style="border: 1px solid black; border-radius: 0.5rem; padding: 0.5rem;">
                    <tr style="background-color: #1e293b; font-size: 1.06rem; color: white;">
                        <th>Name</th>
                        <th>Group</th>
                        <th>Goal</th>
                        <th>Practiced</th>
                        <th>Percent</th>
                    </tr>
                    ${students.map((s, i) => ReportHTML(reports[i], s)).join(' ')}
                </table>`
            : `<p>No data to report yet.</p>`}
       ${students.length > 0 
            ? `<a style="margin-top: 1rem; font-size: 1.2rem;" href="${siteURL}/teachers/${teacher.id}/reports/weekly_logs?view=table">Check out more detailed reports on the Reports Page at Practice HQ</a>`
            : `<a style="margin-top: 1rem; font-size: 1.2rem;" href="${siteURL}/teachers/${teacher.id}">Get started by creating some student profiles!</a>`
       }
    </body>
    </html>`
  )
}

export default WeeklyTeacherReport