import { apiResponse, Enrollee } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRoles } from "../helpers";

export async function POST(request: Request): apiResponse<Enrollee> {
    try {
        const {name, subject, teacher_id, weeklyGoal, dow, time_of_day, duration, timezone, group_id} = await request.json();
        if (!name || !subject || !teacher_id || !weeklyGoal || !dow || !time_of_day || !duration || !timezone) {
            console.error('missing required field(s): name, subject, teacher_id, weeklyGoal, dow, time_of_day, duration, timezone');
        }
        const req_id = request.headers.get('x-user-id');
        const roles = await getRoles(req_id);
        if (!roles.includes('teacher')) {
            return NextResponse.json({message: 'Access Denied'}, {status: 403})
        }
        // const hasConflict = await hasScheduleConflict(teacher_id, '0', parseInt(dow), time_of_day+':00+00', duration);
        // if (hasConflict) {
        //     return NextResponse.json({message: "This would conflict with an existing student's lesson time"}, {status: 409})
        // }
        const insertResponse = await sql`INSERT INTO students (name, subject, teacher_id, weekly_goal, time_of_day, duration, day_of_week, timezone, group_id) VALUES (${name}, ${subject}, ${teacher_id}, ${weeklyGoal}, ${time_of_day}, ${parseInt(duration)}, ${parseInt(dow)}, ${timezone}, ${group_id || null}) RETURNING *`;
        if (insertResponse.rowCount == 0) {
            return NextResponse.json({message: 'failed to create student'}, {status: 500})
        }
        revalidatePath(`/teachers/${teacher_id}`)
        return NextResponse.json({message: 'success', data: insertResponse.rows[0] as Enrollee}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'error on server'}, {status: 500})
    }
}