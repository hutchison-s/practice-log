import { apiResponse, StudentWeekReport } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<StudentWeekReport[]> {
    const {id} = await params;
    const {rows} = await sql`
    WITH week_series AS (
    -- Generate a series of week start dates (adjust the range as needed)
    SELECT GENERATE_SERIES(
        DATE_TRUNC('week', MIN(l.start_time)), 
        DATE_TRUNC('week', MAX(l.start_time)), 
        INTERVAL '1 week'
    ) AS week_start
    FROM logs l
),
student_weeks AS (
    -- Create combinations of students and week start dates
    SELECT 
        s.id AS student_id, 
        s.name,
        s.subject,
        TO_CHAR((DATE '1970-01-01' + s.day_of_week), 'FMDay') AS day,
        TO_CHAR(s.time_of_day::time, 'hh12:mi AM') AS time,
        g.name AS group_name,
        ws.week_start,
        s.weekly_goal
    FROM 
        students s
    CROSS JOIN 
        week_series ws
    LEFT JOIN 
        groups g ON g.id = s.group_id
    WHERE 
        s.teacher_id = ${id}
),
logs_aggregated AS (
    -- Aggregate logs data by student and week
    SELECT 
        l.student_id, 
        DATE_TRUNC('week', l.start_time) AS week_start,
        COUNT(l.id) AS log_count,
        COALESCE(SUM(l.total_time::numeric / 60), 0) AS practice_minutes
    FROM 
        logs l
    GROUP BY 
        l.student_id, 
        DATE_TRUNC('week', l.start_time)
)
-- Join the combinations with aggregated log data
SELECT
    sw.student_id,
    sw.subject,
    sw.name,
    sw.day,
    sw.time,
    sw.group_name AS group,
    TO_CHAR(sw.week_start, 'Mon DD, YYYY') AS week,
    COALESCE(la.log_count, 0) AS logs,
    sw.weekly_goal AS goal,
    ROUND(COALESCE(la.practice_minutes, 0), 0) AS mins,
    ROUND(
        COALESCE(
            (COALESCE(la.practice_minutes, 0) / NULLIF(sw.weekly_goal, 0) * 100),
            0
        ), 2
    ) AS grade
FROM 
    student_weeks sw
LEFT JOIN 
    logs_aggregated la 
    ON sw.student_id = la.student_id AND sw.week_start = la.week_start
ORDER BY 
    sw.name ASC,
    sw,subject ASC,
    sw.week_start ASC;`
    return NextResponse.json({message: 'success', data: rows as StudentWeekReport[]})
}