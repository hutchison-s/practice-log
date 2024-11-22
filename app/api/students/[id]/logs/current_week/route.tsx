import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { apiResponse, WeeklyPractice } from "@/app/types";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<WeeklyPractice> {
    const id = (await params).id;
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied'}, {status: 401})
    const studentResponse = await sql`SELECT id, weekly_goal, day_of_week FROM students WHERE id = ${id} AND (id = ${user.userId} OR teacher_id = ${user.userId})`;
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
            s.id = ${id} AND (s.id = ${user.userId} OR s.teacher_id = ${user.userId})
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