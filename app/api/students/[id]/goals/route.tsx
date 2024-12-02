import { apiResponse, Goal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Goal[]> {
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
            const {rows}: {rows: Goal[]} = await sql`
                SELECT 
                    g.* 
                FROM 
                    goals AS g
                INNER JOIN 
                    students AS s ON s.id = g.student_id
                WHERE 
                    g.student_id = ${id} 
                    AND 
                    (s.teacher_id = ${user.userId} OR g.student_id = ${user.userId})
                ORDER BY
                    g.is_complete ASC, g.created_at DESC`;
            return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
    
}