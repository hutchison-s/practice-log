import { userIs } from "@/app/api/helpers";
import { apiResponse, Goal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, goal_id: string }> }
): apiResponse<Goal> {

    try {
        const {id, goal_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!(await userIs('teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const { goal_title, goal_content, is_complete } = await request.json();
        if (!goal_title) {
            return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
        }
        const { rows } = await sql`
            UPDATE goals
            SET 
                goal_title = ${goal_title}, 
                goal_content = ${goal_content}, 
                is_complete = ${is_complete}
            WHERE id = ${goal_id}
            RETURNING *
        `;
        if (rows.length === 0) {
            return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Success', data: rows[0] as Goal }, { status: 200 });
    } catch (err) {
        console.error('Error processing PATCH request:', err);
        return NextResponse.json({ message: 'Failed to update goal' }, { status: 500 });
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string, goal_id: string }> }
): apiResponse<Goal> {
    try {
        const {id, goal_id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('teacher', {user_id: req_id, student_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        await sql`DELETE FROM goals WHERE id = ${goal_id} RETURNING *`;
        return NextResponse.json({message: 'success'}, {status: 200});
    } catch (error) {
        console.error('Error processing PATCH request:', error);
        return NextResponse.json({ message: 'Failed to delete goal' }, { status: 500 });
    }
}