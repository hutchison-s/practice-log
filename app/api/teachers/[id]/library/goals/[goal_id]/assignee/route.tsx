import { Goals } from "@/app/api/_controllers/tableControllers";
import { apiResponse, Enrollee, LibraryGoal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string, goal_id: string}>}): apiResponse<Enrollee[]> {
    const {id, goal_id} = await params;
    const {rows} = await sql<LibraryGoal>`SELECT * FROM library_goals WHERE id = ${goal_id}`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'failure'}, {status: 404});
    const lg = rows[0];
    const {rows: students} = await sql`
        SELECT s.*
        FROM students AS s
        INNER JOIN goals AS g ON g.student_id = s.id
        WHERE g.title = ${lg.title} AND g.content = ${lg.content} AND s.teacher_id = ${id}
    `;
    return NextResponse.json({message: 'success', data: students as Enrollee[]})
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string, goal_id: string}>}) {
    try {
        const {id, goal_id} = await params;
        const {student_ids}: {student_ids: string[]} = await request.json();
        if (!student_ids) {
            return NextResponse.json({message: 'Missing required body in request'}, {status: 400});
        }
        if (student_ids.length == 0) {
            return NextResponse.json({message: 'success'}, {status: 200});
        }
        const {rows: libgoals} = await sql<LibraryGoal>`SELECT * FROM library_goals WHERE id = ${goal_id}`;
        if (!libgoals || libgoals.length == 0) return NextResponse.json({message: 'failure'}, {status: 404});
        const goal_template = libgoals[0];
        const {rows: inserting_ids} = await sql`
            SELECT students.id
            FROM students
            WHERE students.teacher_id = ${id}
            AND position(students.id::text IN ${student_ids.join(',')}) != 0
            AND NOT EXISTS (
                SELECT 1 
                FROM goals 
                WHERE goals.student_id = students.id 
                AND goals.title = ${goal_template.title}
                AND goals.content = ${goal_template.content}
            );`
        for (const {id} of inserting_ids) {
            await Goals(id).createOne({title: goal_template.title, content: goal_template.content})
            revalidateTag(`goals${id}`)
        }
        
        return NextResponse.json({message: 'success', data: student_ids}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'Server error occured'}, {status: 500});
    }
}