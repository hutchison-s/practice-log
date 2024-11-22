import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { fetchJSONWithToken } from "@/app/AuthHandler";
import { apiResponse, EnrolleeWithCurrentWeekPractice, WeeklyPractice } from "@/app/types";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<EnrolleeWithCurrentWeekPractice[]> {
    const apiURL = process.env.NEXT_PUBLIC_API_URL_BASE;
    const id = (await params).id;
    const token = request.cookies.get('token')?.value
    if (!token) return NextResponse.json({message: 'not authorized'}, {status: 401})
    const user = jwt.decode(token, {json: true});
    if (!user || id != user.userId) return NextResponse.json({message: 'not authorized'}, {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
        const { rowCount, rows } = await sql`
        SELECT 
            s.id, 
            s.name, 
            s.code, 
            s.created_at, 
            s.updated_at, 
            s.teacher_id, 
            s.subject, 
            s.weekly_goal,
            s.day_of_week,
            SUM(log.total_time) AS total_practice_time
        FROM 
            students AS s
        LEFT JOIN 
            logs AS log ON log.student_id = s.id
        WHERE 
            s.teacher_id = ${id}
        GROUP BY
            s.id, 
            s.name, 
            s.code, 
            s.created_at, 
            s.updated_at, 
            s.teacher_id, 
            s.subject, 
            s.weekly_goal,
            s.day_of_week;
        `;
        for (const s of rows) {
            const {data} = await fetchJSONWithToken<WeeklyPractice>(`${apiURL}/students/${s.id}/logs/current_week`);
            s.current_week_minutes = data?.current_week_minutes;
        }
        return NextResponse.json({
            message: 'success', 
            data: rowCount && rowCount > 0 ? rows as EnrolleeWithCurrentWeekPractice[]: []
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}
