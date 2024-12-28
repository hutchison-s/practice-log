import { apiResponse, Message } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Message[]> {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied'}, {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
            const {rows}: {rows: Message[]} = await sql`
                SELECT 
                    m.* 
                FROM 
                    messages AS m
                INNER JOIN 
                    students AS s ON s.id = m.student_id
                WHERE 
                    m.student_id = ${id} 
                    AND 
                    (s.teacher_id = ${user.userId} OR m.student_id = ${user.userId})
                ORDER BY
                    m.created_at ASC`;
            return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const {content} = await request.json();
    if (!content) return NextResponse.json({message: 'content field is required'}, {status: 400})
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied, no token present'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied, could not validate token'}, {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
        const {rows: teacher_ids} = await sql`SELECT teacher_id FROM students WHERE id = ${id};`
        const {teacher_id} = teacher_ids[0];
        console.log(teacher_id, id, user.userId)
        if (user.userId != teacher_id && user.userId != id) {
            return NextResponse.json({message: 'access denied, user does not belong to this chat'}, {status: 401}); 
        }
        const {rows}: {rows: Message[]} = await sql`
            INSERT INTO messages
                (student_id, sent_by, content)
            VALUES
                (${id}, ${user.userId}, ${content})`;
        revalidatePath(`/students/${id}/messages`)
        return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}