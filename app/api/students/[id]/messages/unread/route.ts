import { apiResponse } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<number> {
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
            const {rows}: {rows: {new_messages: number}[]} = await sql`
                SELECT 
                    COUNT(m.id) as new_messages
                FROM 
                    messages AS m
                INNER JOIN 
                    students AS s ON s.id = m.student_id
                WHERE 
                    m.student_id = ${id} 
                    AND 
                    (s.teacher_id = ${user.userId} OR m.student_id = ${user.userId})
                    AND
                    m.is_read = FALSE
                    AND
                    m.sent_by != ${user.userId}`;
            return NextResponse.json({data: rows[0].new_messages, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
}