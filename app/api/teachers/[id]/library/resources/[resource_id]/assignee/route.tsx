import { Resources } from "@/app/api/_controllers/tableControllers";
import { apiResponse, Enrollee, LibraryResource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string, resource_id: string}>}): apiResponse<Enrollee[]> {
    const {id, resource_id} = await params;
    const req_id = request.headers.get('x-user-id');
    if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})    
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

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string, resource_id: string}>}) {
    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})    
        const {student_ids, resource_template}: {student_ids: string[], resource_template: LibraryResource} = await request.json();
        if (!student_ids) {
            return NextResponse.json({message: 'Missing required body in request'}, {status: 400});
        }
        if (student_ids.length == 0) {
            return NextResponse.json({message: 'success'}, {status: 200});
        }
        const {rows: inserting_ids} = await sql`
            SELECT students.id
            FROM students
            WHERE students.teacher_id = ${id}
            AND position(students.id::text IN ${student_ids.join(',')}) != 0
            AND NOT EXISTS (
                SELECT 1 
                FROM resources 
                WHERE resources.student_id = students.id 
                AND resources.key = ${resource_template.key}
            );`
        const {title, url, key, type} = resource_template;
        for (const each of inserting_ids) {
            const added = await Resources(each.id).createOne({title, url, key, type});
            console.log(added)
            revalidateTag(`resources${id}`)
        }
        
        return NextResponse.json({message: 'success', data: student_ids}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'Server error occured'}, {status: 500});
    }
}