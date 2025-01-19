import { apiResponse, Message } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { userIs } from "@/app/api/helpers";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Message[]> {
    
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('owner or teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        if (!id) return NextResponse.json({message: 'Invalid URL'}, {status: 404})
            const {rows}: {rows: Message[]} = await sql`
                SELECT 
                    * 
                FROM 
                    messages
                WHERE 
                    student_id = ${id} 
                ORDER BY
                    created_at ASC`;
            return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const {content} = await request.json();
    if (!content) return NextResponse.json({message: 'content field is required'}, {status: 400})
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('owner or teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const {rows: teacher_ids} = await sql`SELECT teacher_id FROM students WHERE id = ${id};`
        const {teacher_id} = teacher_ids[0];
        if (req_id != teacher_id && req_id != id) {
            return NextResponse.json({message: 'access denied, user does not belong to this chat'}, {status: 401}); 
        }
        const {rows}: {rows: Message[]} = await sql`
            INSERT INTO messages
                (student_id, sent_by, content)
            VALUES
                (${id}, ${req_id}, ${content})`;
        revalidatePath(`/students/${id}/messages`)
        return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}