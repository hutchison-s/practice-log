import { fetchStudent } from "@/app/(pages)/students/[id]/actions";
import { userIs } from "@/app/api/helpers";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "postcss";

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string, message_id: string}>}) {
    
    try {
        const {id, message_id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const {teacher_id} = await fetchStudent(id);
        const {rows}: {rows: Message[]} = await sql`
            UPDATE 
                messages
            SET
                is_read = TRUE
            WHERE
                id = ${message_id}`;
        revalidatePath(`/students/${id}`)
        revalidatePath(`/api/students/${id}`)
        revalidatePath(`/teachers/${teacher_id}`)
        return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}