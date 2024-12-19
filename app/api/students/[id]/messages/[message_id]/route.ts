import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "postcss";
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string, message_id: string}>}) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied, no token present'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied, could not validate token'}, {status: 401})
    try {
        const {id, message_id} = (await params);
        if (!id) throw new Error('No id parameter present');
        const {rows: teacher_ids} = await sql`SELECT teacher_id FROM students WHERE id = ${id};`
        const {teacher_id} = teacher_ids[0];
        console.log(teacher_id, id, user.userId)
        if (user.userId != teacher_id && user.userId != id) {
            return NextResponse.json({message: 'access denied, user does not belong to this chat'}, {status: 401}); 
        }
        const {rows}: {rows: Message[]} = await sql`
            UPDATE 
                messages
            SET
                is_read = TRUE
            WHERE
                id = ${message_id}`;
        revalidatePath(`/students/${id}`)
        revalidatePath(`/teachers/${teacher_id}`)
        return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}