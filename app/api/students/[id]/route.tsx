import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { apiResponse, Enrollee } from "@/app/types";
import { revalidatePath } from "next/cache";
import { userIs } from "../../helpers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<Enrollee> {

    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('owner or teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const response = await sql`
            SELECT 
                s.*,
                g.color AS group_color 
            FROM students as s
            LEFT JOIN groups AS g ON g.id = s.group_id
            WHERE s.id = ${id}`;
        return NextResponse.json({message: 'success', data: response.rows[0] as Enrollee}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<Enrollee> {
    try {
        const {name, subject, weekly_goal, day_of_week, time_of_day, duration, group_id} = await request.json();
        if (!name || !subject || !weekly_goal || day_of_week < 0 || day_of_week > 6 || isNaN(day_of_week) || !time_of_day || !duration) {
            return NextResponse.json({message: 'Missing required parameters'}, {status: 400})
        }
        const {id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        // const hasConflict = await hasScheduleConflict(req_id!, id, parseInt(day_of_week), time_of_day, duration);
        // if (hasConflict) {
        //     return NextResponse.json({message: "This would conflict with an existing student's lesson time"}, {status: 409})
        // }
        const response = await sql`UPDATE students SET name = ${name}, subject = ${subject}, weekly_goal = ${weekly_goal}, time_of_day = ${time_of_day}, duration = ${parseInt(duration)}, day_of_week = ${day_of_week}, group_id = ${group_id} WHERE id = ${id} RETURNING *`;
        revalidatePath(`/teachers/${req_id}`)
        revalidatePath(`/students/${id}`)
        return NextResponse.json({message: 'success', data: response.rows[0] as Enrollee}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }
}

export  async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<undefined> {
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        await sql`DELETE FROM students WHERE id = ${id}`;
        revalidatePath(`/teachers/${req_id}`)
        revalidatePath(`/students/${id}`)
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }

}