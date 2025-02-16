import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string, group_id: string}>}) {
    try {
        const {id, group_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})    
        const {resource_template} = await request.json();
        if (!resource_template || !resource_template.title || !resource_template.key || !resource_template.url || !resource_template.type) {
            return NextResponse.json({message: 'Missing required body in request'}, {status: 400})
        }
        const {rows, rowCount} = await sql`
            INSERT INTO resources (
                title,
                url,
                type,
                key,
                student_id,
                created_by
            )
            SELECT
                ${resource_template.title},
                ${resource_template.url},
                ${resource_template.type},
                ${resource_template.key},
                students.id,
                ${id}
            FROM
                students
            WHERE
                students.group_id = ${group_id}
                AND NOT EXISTS (
                    SELECT 1 
                    FROM resources 
                    WHERE resources.student_id = students.id 
                    AND resources.key = ${resource_template.key}
                )
            RETURNING student_id
        `
        revalidatePath(`/teachers/${id}`)
        return NextResponse.json({message: `successfully shared with ${rowCount} students`, data: rows})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'server error'}, {status: 500})
    }

}