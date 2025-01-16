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
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const response = await sql`SELECT * FROM students WHERE id = ${id}`;
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
        const {name, subject, weeklyGoal, dow, time_of_day, group_id} = await request.json();
        if (!name || !subject || !weeklyGoal || dow < 0 || dow > 6 || isNaN(dow)) {
            return NextResponse.json({message: 'Missing required parameters'}, {status: 400})
        }
        const {id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const response = await sql`UPDATE students SET name = ${name}, subject = ${subject}, weekly_goal = ${weeklyGoal}, time_of_day = ${time_of_day},day_of_week = ${dow}, group_id = ${group_id} WHERE id = ${id}`;
        revalidatePath(`/teachers/${req_id}`)
        revalidatePath(`/api/teachers/${req_id}`)
        revalidatePath(`/api/students/${id}`)
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
        if (!(await userIs('teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        await sql`DELETE FROM students WHERE id = ${id}`;
        revalidatePath(`/teachers/${req_id}`)
        revalidatePath(`/api/teachers/${req_id}`)
        revalidatePath(`/api/students/${id}`)
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }

}