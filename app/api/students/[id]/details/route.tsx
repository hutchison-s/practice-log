import { userIs } from "@/app/api/helpers";
import { apiResponse, Enrollee, Goal, logRow, Resource, WeeklyPractice} from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<{student: Enrollee, logs: logRow[], resources: Resource[], goals: Goal[], thisWeek: WeeklyPractice}> {
    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }

        const {rows:students} = await sql`
            SELECT 
                * 
            FROM 
                students 
            WHERE 
                id = ${id}`;
        const student = students[0]
        const {rows:logs} = await sql`
            SELECT 
                log.id AS log_id,
                s.id AS student_id, 
                s.name AS name, 
                log.start_time AS start, 
                log.total_time AS seconds,
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
        const weekStart = new Date();
        while (weekStart.getDay() != parseInt(student.day_of_week)) {
            weekStart.setDate(weekStart.getDate() - 1);
        }
        const weekStartTimestamp = weekStart.toISOString();
        const {rows:weeks} = await sql`
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
        const thisWeek = weeks[0];
        return NextResponse.json({message: 'success', data: {
            student: student as Enrollee,
            logs: logs as logRow[] || [],
            resources: resources as Resource[] || [],
            goals: goals as Goal[] || [],
            thisWeek: thisWeek as WeeklyPractice
        }}, {status: 200})

    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }
  }