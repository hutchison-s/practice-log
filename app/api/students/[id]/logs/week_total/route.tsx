import { userIs } from "@/app/api/helpers";
import { apiResponse, weeklyTotal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }): apiResponse<weeklyTotal[]> {

    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('owner or teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        if (!id) return NextResponse.json({message: 'Invalid URL'}, {status: 404})
        const {searchParams} = request.nextUrl;
        const isCurrent = searchParams.get('current')
        const {rows} = isCurrent
            ? await sql`
            SELECT
              DATE_TRUNC('DAY', CURRENT_TIMESTAMP AT TIME ZONE s.timezone) - (INTERVAL '1 day' * (((EXTRACT(DOW from CURRENT_TIMESTAMP AT TIME ZONE s.timezone) + 7) - s.day_of_week) % 7)) as lesson_week_start,
              l.student_id,
              s.weekly_goal,
              sum(l.total_time) AS weekly_total
            FROM
              logs AS l
            LEFT JOIN
              students AS s ON l.student_id = s.id
            WHERE
              l.student_id = ${id} AND l.start_time AT TIME ZONE s.timezone >= DATE_TRUNC('DAY', CURRENT_TIMESTAMP AT TIME ZONE s.timezone) - (INTERVAL '1 day' * (((EXTRACT(DOW from CURRENT_TIMESTAMP AT TIME ZONE s.timezone) + 7) - s.day_of_week) % 7))
            GROUP BY
              lesson_week_start, l.student_id, s.weekly_goal;
            `
            : await sql`
          SELECT
            DATE_TRUNC('day', l.start_time AT TIME ZONE s.timezone) - (INTERVAL '1 day' * (((EXTRACT(DOW FROM l.start_time AT TIME ZONE s.timezone) + 7) - s.day_of_week) % 7)) AS lesson_week_start,
            l.student_id,
            s.weekly_goal,
            sum(l.total_time) AS weekly_total
          FROM
            logs AS l
          LEFT JOIN
            students AS s ON l.student_id = s.id
          WHERE
            l.student_id = ${id}
          GROUP BY
            lesson_week_start, l.student_id, s.weekly_goal;
        `;
        return NextResponse.json({data: rows.length > 0 ? rows as weeklyTotal[] : [] as weeklyTotal[], message: 'success'}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
    }




}