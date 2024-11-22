import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    try {
        const {name, subject, teacher_id, weeklyGoal, dow} = await request.json();
        if (!name || !subject || !teacher_id || !weeklyGoal || !dow) {
            console.error('missing required field(s)', name, subject, teacher_id, weeklyGoal, dow);
        }
        const insertResponse = await sql`INSERT INTO students (name, subject, teacher_id, weekly_goal, day_of_week) VALUES (${name}, ${subject}, ${teacher_id}, ${weeklyGoal}, ${parseInt(dow)}) RETURNING *`;
        if (insertResponse.rowCount == 0) {
            return new Response(JSON.stringify({message: 'failed to fetch'}), {status: 400})
        }
        revalidatePath('/')
        return new Response(JSON.stringify({message: 'success', student: insertResponse.rows[0]}), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify({message: 'error on server'}), {status: 500})
    }
}