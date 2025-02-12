import { apiResponse, Enrollee, LibraryResource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string, resource_id: string}>}): apiResponse<Enrollee[]> {
    const {id, resource_id} = await params;
    const {rows} = await sql<LibraryResource>`SELECT * FROM library_resources WHERE id = ${resource_id}`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'failure'}, {status: 404});
    const lr = rows[0];
    const {rows: students} = await sql`
        SELECT s.*
        FROM students AS s
        INNER JOIN resources AS r ON r.student_id = s.id
        WHERE r.key = ${lr.key} AND s.teacher_id = ${id}
    `;
    return NextResponse.json({message: 'success', data: students as Enrollee[]})
}