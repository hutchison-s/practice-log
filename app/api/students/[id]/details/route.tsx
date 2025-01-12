import { userIs } from "@/app/api/helpers";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import { apiResponse, Enrollee, Goal, logRow, Resource, weeklyTotal} from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<{student: Enrollee, logs: logRow[], resources: Resource[], goals: Goal[], thisWeek: weeklyTotal}> {
    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        const {data: student} = await fetchJSONWithToken<Enrollee>(`${apiURL}/students/${id}`)
        const {rows: logs} = await sql`
            SELECT 
                log.id AS log_id,
                s.id AS student_id, 
                s.name AS name, 
                log.start_time AS start_time, 
                log.total_time AS total_time,
                log.journal as journal 
            FROM 
                students AS s 
            JOIN 
                logs as log ON log.student_id = s.id 
            WHERE 
                s.id = ${id}
            ORDER BY
                log.start_time DESC
            LIMIT 
                6`;
        const {rows:resources} = await sql`
            SELECT 
                * 
            FROM 
                resources 
            WHERE 
                student_id = ${id} 
            ORDER BY 
                created_at DESC 
            LIMIT 6`
        const {rows:goals} = await sql`
            SELECT 
                g.* 
            FROM 
                goals AS g
            INNER JOIN 
                students AS s ON s.id = g.student_id
            WHERE 
                g.student_id = ${id} 
                AND 
                (s.teacher_id = ${req_id} OR g.student_id = ${req_id})
            ORDER BY
                g.is_complete ASC, g.created_at DESC`;
        
        const {data: weeks} = await fetchJSONWithToken<weeklyTotal[]>(`${apiURL}/students/${id}/logs/week_total?current=true`);
        const thisWeek = weeks![0];
        return NextResponse.json({message: 'success', data: {
            student: student as Enrollee,
            logs: logs as logRow[] || [],
            resources: resources as Resource[] || [],
            goals: goals as Goal[] || [],
            thisWeek: thisWeek
        }}, {status: 200})

    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }
  }