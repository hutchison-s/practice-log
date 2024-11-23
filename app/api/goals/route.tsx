import { apiResponse, Goal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest): apiResponse<Goal[]> {
    const searchParams = request.nextUrl.searchParams;
    const student_id = searchParams.get('student_id');
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied'}, {status: 401})

    if (student_id) {
        try {
            const {rows}: {rows: Goal[]} = await sql`
                SELECT 
                    g.* 
                FROM 
                    goals AS g
                INNER JOIN 
                    students AS s ON s.id = g.student_id
                WHERE 
                    g.student_id = ${student_id} 
                    AND 
                    (s.teacher_id = ${user.userId} OR g.student_id = ${user.userId})
                ORDER BY
                    g.is_complete ASC, g.created_at DESC`;
            return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
    } else {
        try {
            const {rows}: {rows: Goal[]} = await sql`
                SELECT 
                    g.* 
                FROM 
                    goals AS g
                INNER JOIN 
                    students AS s ON s.id = g.student_id
                WHERE
                    (s.teacher_id = ${user.userId} OR g.student_id = ${user.userId})
                ORDER BY
                    g.is_complete ASC, g.created_at DESC`;
            return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }

    }
}

export async function POST(request: NextRequest): apiResponse<Goal> {
    const {student_id, title, content} = await request.json();
    if (!student_id || !title || !content) {
        console.error('-----------missing required fields in post request------------------')
        return NextResponse.json({message: 'invalid request format'}, {status: 400})
    }
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) {
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    try {
        const {rows}: {rows: Goal[]} = await sql`
            INSERT INTO goals 
                (student_id, goal_title, goal_content)
            VALUES
                (${student_id}, ${title}, ${content})
            RETURNING *`
        return NextResponse.json({data: rows[0], message: 'success'}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'could not create goal'}, {status: 500})
    }
}