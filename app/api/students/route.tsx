import { apiResponse, Enrollee } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request): apiResponse<Enrollee> {
    try {
        const {name, subject, teacher_id, weeklyGoal, dow} = await request.json();
        if (!name || !subject || !teacher_id || !weeklyGoal || !dow) {
            console.error('missing required field(s)', name, subject, teacher_id, weeklyGoal, dow);
        }
        const insertResponse = await sql`INSERT INTO students (name, subject, teacher_id, weekly_goal, day_of_week) VALUES (${name}, ${subject}, ${teacher_id}, ${weeklyGoal}, ${parseInt(dow)}) RETURNING *`;
        if (insertResponse.rowCount == 0) {
            return NextResponse.json({message: 'failed to fetch'}, {status: 400})
        }
        revalidatePath('/')
        return NextResponse.json({message: 'success', data: insertResponse.rows[0] as Enrollee}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'error on server'}, {status: 500})
    }
}