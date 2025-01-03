import { userIs } from "@/app/api/helpers";
import { apiResponse, Goal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Goal[]> {
    
    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
            const {rows}: {rows: Goal[]} = await sql`
                SELECT 
                    * 
                FROM 
                    goals
                WHERE 
                    student_id = ${id} 
                ORDER BY
                    is_complete ASC, created_at DESC`;
            return NextResponse.json({data: rows, message: 'success'}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'could not fetch goals'}, {status: 500})
        }
    
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Goal> {
    const {title, content} = await request.json();
    if (!title || !content) {
        return NextResponse.json({message: 'invalid request format'}, {status: 400})
    }
    
    try {
        const {id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const {rows}: {rows: Goal[]} = await sql`
            INSERT INTO goals 
                (student_id, goal_title, goal_content, created_by)
            VALUES
                (${id}, ${title}, ${content}, ${req_id})
            RETURNING *`
        revalidatePath(`/students/${id}`);
        revalidatePath(`/teachers/${req_id}`);
        return NextResponse.json({data: rows[0], message: 'success'}, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'could not create goal'}, {status: 500})
    }
}