import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string, group_id: string}>}) {
    try {
        const {id, group_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})    
        const {goal_template} = await request.json();
        if (!goal_template || !goal_template.title) {
            return NextResponse.json({message: 'Missing required body in request'}, {status: 400})
        }
        const {rows, rowCount} = await sql`
            INSERT INTO goals (
                title,
                content,
                student_id,
                created_by
            )
            SELECT
                ${goal_template.title},
                ${goal_template.content},
                students.id,
                ${id}
            FROM
                students
            WHERE
                students.group_id = ${group_id}
                AND NOT EXISTS (
                    SELECT 1 
                    FROM goals 
                    WHERE goals.student_id = students.id 
                    AND goals.title = ${goal_template.title}
                    AND goals.content = ${goal_template.content}
                )
            RETURNING student_id
        `
        revalidatePath(`/teachers/${id}`)
        return NextResponse.json({message: `successfully assigned to to ${rowCount} students`, data: rows})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'server error'}, {status: 500})
    }

}