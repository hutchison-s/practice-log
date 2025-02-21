import { StudentWeekReport } from "@/app/types";
import { sql } from "@vercel/postgres";

export async function getReport(id: string) {
    const {rows} = await sql`
        WITH week_series AS (
        SELECT GENERATE_SERIES(
        CURRENT_DATE - INTERVAL '1 day' * EXTRACT(DOW FROM CURRENT_DATE), 
        CURRENT_DATE - INTERVAL '1 day' * EXTRACT(DOW FROM CURRENT_DATE),
        INTERVAL '-1 week'
    ) AS week_start
),
student_weeks AS (
    SELECT 
        s.id AS student_id, 
        s.name,
        s.subject,
        TO_CHAR((DATE '1970-01-01' + s.day_of_week), 'FMDay') AS day,
        TO_CHAR(s.time_of_day::time, 'hh12:mi AM') AS time,
        g.name AS group_name,
        g.color AS group_color,
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
        DATE_TRUNC('week', l.start_time) 
           + INTERVAL '1 day' * (CASE WHEN EXTRACT(DOW FROM l.start_time) = 0 
                                      THEN 0 
                                      ELSE -EXTRACT(DOW FROM l.start_time) END) 
           AS week_start,
        COUNT(l.id) AS log_count,
        COALESCE(SUM(l.total_time::numeric / 60), 0) AS practice_minutes
    FROM 
        logs l
    GROUP BY 
        l.student_id, 
        DATE_TRUNC('week', l.start_time) 
           + INTERVAL '1 day' * (CASE WHEN EXTRACT(DOW FROM l.start_time) = 0 
                                      THEN 0 
                                      ELSE -EXTRACT(DOW FROM l.start_time) END)
)
-- Join the combinations with aggregated log data
SELECT
    sw.student_id,
    sw.subject,
    sw.name,
    sw.day,
    sw.time,
    sw.group_name AS group,
    sw.group_color AS color,
    TO_CHAR(sw.week_start, 'Mon DD, YYYY') AS week,
    COALESCE(la.log_count, 0) AS logs,
    sw.weekly_goal AS goal,
    ROUND(COALESCE(la.practice_minutes, 0), 0) AS mins,
    ROUND(
        COALESCE(
            (COALESCE(la.practice_minutes, 0) / NULLIF(sw.weekly_goal, 0) * 100),
            0
        ), 0
    ) AS grade
FROM 
    student_weeks sw
LEFT JOIN 
    logs_aggregated la 
    ON sw.student_id = la.student_id AND sw.week_start = la.week_start
ORDER BY 
    sw.name ASC,
    sw.subject ASC,
    sw.week_start ASC;`
    return rows as StudentWeekReport[];
}