import { userIs } from "@/app/api/helpers";
import { apiResponse } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<number> {
    
    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const {rows}: {rows: {new_messages: number}[]} = await sql`
            SELECT 
                COUNT(id) as new_messages
            FROM 
                messages
            WHERE 
                student_id = ${id} AND is_read = FALSE AND sent_by != ${req_id}`;
            return NextResponse.json({data: rows[0].new_messages, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}