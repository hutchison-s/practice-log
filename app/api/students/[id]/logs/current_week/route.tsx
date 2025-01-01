import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { apiResponse, WeeklyPractice } from "@/app/types";
import { userIs } from "@/app/api/helpers";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<WeeklyPractice> {
    const {id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const studentResponse = await sql`SELECT id, weekly_goal, day_of_week FROM students WHERE id = ${id} AND (id = ${req_id} OR teacher_id = ${req_id})`;
    if (studentResponse.rowCount !== 1) return NextResponse.json({message: 'invalid request'}, {status: 400})
    const student = studentResponse.rows[0];
    const weekStart = new Date();
    while (weekStart.getDay() != parseInt(student.day_of_week)) {
        weekStart.setDate(weekStart.getDate() - 1);
    }
    const weekStartTimestamp = weekStart.toISOString();
    try {
        
        const { rowCount, rows } = await sql`
        SELECT
            s.id, 
            s.weekly_goal,
            COALESCE(SUM(CASE 
                WHEN log.start_time >= ${weekStartTimestamp} THEN log.total_time 
                ELSE 0 
            END), 0) / 60 AS current_week_minutes
        FROM 
            students AS s
        LEFT JOIN 
            logs AS log ON log.student_id = s.id
        WHERE 
            s.id = ${id}
        GROUP BY
            s.id,
            s.weekly_goal;
        `;

        
        return NextResponse.json({
            message: 'success', 
            data: rowCount == 1 ? rows[0] as WeeklyPractice : undefined
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}