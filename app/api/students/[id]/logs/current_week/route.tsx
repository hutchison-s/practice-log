import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    const studentResponse = await sql`SELECT id, weekly_goal, day_of_week FROM students WHERE id = ${id} AND (id = ${user.userId} OR teacher_id = ${user.userId})`;
    if (studentResponse.rowCount !== 1) return new Response(JSON.stringify({message: 'invalid request'}), {status: 400})
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

        
        return new Response(JSON.stringify({
            message: 'success', 
            data: rowCount == 1 ? rows[0] : []
        }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'failure on server' }), { status: 500 });
    }
}