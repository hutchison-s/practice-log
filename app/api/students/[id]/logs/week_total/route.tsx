import { userIs } from "@/app/api/helpers";
import { apiResponse, weeklyTotal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }): apiResponse<weeklyTotal[]> {

    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        if (!id) return NextResponse.json({message: 'Invalid URL'}, {status: 404})
        const {searchParams} = request.nextUrl;
        const isCurrent = searchParams.get('current')
        const {rows} = isCurrent
            ? await sql`
            SELECT 
            logs.student_id,
            DATE_TRUNC('day', logs.start_time) - 
                ((EXTRACT(DOW FROM logs.start_time)::int - students.day_of_week + 7) % 7) * INTERVAL '1 day' + INTERVAL '1 days' AS lesson_week_start,
            SUM(logs.total_time) AS weekly_total
          FROM 
            logs
          JOIN 
            students ON logs.student_id = students.id
          WHERE 
            logs.student_id = ${id}
            AND DATE_TRUNC('day', logs.start_time) - 
                ((EXTRACT(DOW FROM logs.start_time)::int - students.day_of_week + 7) % 7) * INTERVAL '1 day' + INTERVAL '1 days'  = DATE_TRUNC('day', CURRENT_DATE) - 
        ((EXTRACT(DOW FROM CURRENT_DATE)::int - students.day_of_week + 7) % 7) * INTERVAL '1 day' + INTERVAL '1 days'
          GROUP BY 
            logs.student_id, lesson_week_start
          ORDER BY 
            lesson_week_start;
            `
            : await sql`
          SELECT 
            logs.student_id,
            DATE_TRUNC('day', logs.start_time) - 
                ((EXTRACT(DOW FROM logs.start_time)::int - students.day_of_week + 7) % 7) * INTERVAL '1 day' + INTERVAL '1 days' AS lesson_week_start,
            SUM(logs.total_time) AS weekly_total
          FROM 
            logs
          JOIN 
            students ON logs.student_id = students.id
          WHERE 
            logs.student_id = ${id}
          GROUP BY 
            logs.student_id, lesson_week_start
          ORDER BY 
            lesson_week_start;
        `;
        return NextResponse.json({data: rows ? rows as weeklyTotal[] : [] as weeklyTotal[], message: 'success'}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
    }




}