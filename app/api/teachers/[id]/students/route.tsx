import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { fetchJSONWithToken } from "@/app/AuthHandler";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return new Response(JSON.stringify({message: 'not authorized'}), {status: 401})
    const user = jwt.decode(token!.value, {json: true});
    if (!user || id != user.userId) return new Response(JSON.stringify({message: 'not authorized'}), {status: 401})
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
            const {data} = await fetchJSONWithToken(`http://localhost:3000/api/students/${s.id}/logs/current_week`);
            s.current_week_minutes = data.current_week_minutes;
        }
        return new Response(JSON.stringify({
            message: 'success', 
            students: rowCount && rowCount > 0 ? rows : []
        }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'failure on server' }), { status: 500 });
    }
}
