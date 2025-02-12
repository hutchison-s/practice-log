import { apiResponse, Enrollee, LibraryGoal } from "@/app/types";
import { sql } from "@vercel/postgres";
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