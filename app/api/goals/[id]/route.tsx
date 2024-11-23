import { apiResponse, Goal } from '@/app/types';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<Goal> {

    // Extract and verify token
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('No token present in the request');
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    const user = jwt.decode(token, { json: true });
    if (!user) {
        console.error('Invalid token: unable to decode');
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    try {
        // Extract ID and request body
        const id = (await params).id;
        if (!id) throw new Error('No "id" parameter provided');

        const { goal_title, goal_content, is_complete, student_id } = await request.json();
        if (!goal_title || !student_id) {
            return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
        }

        // Fetch teacher ID from the database
        const { rows: teacherRows } = await sql`
            SELECT teacher_id FROM students WHERE id = ${student_id}
        `;
        const teacher_id = teacherRows[0]?.teacher_id;

        if (!teacher_id) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        // Verify user authorization
        if (student_id !== user.userId && teacher_id !== user.userId) {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }

        // Update goal in the database
        const { rows } = await sql`
            UPDATE goals
            SET 
                goal_title = ${goal_title}, 
                goal_content = ${goal_content}, 
                is_complete = ${is_complete}
            WHERE id = ${id}
            RETURNING *
        `;

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
        }

        // Respond with the updated goal
        return NextResponse.json({ message: 'Success', data: rows[0] as Goal }, { status: 200 });
    } catch (err) {
        // Handle errors gracefully
        console.error('Error processing PATCH request:', err);
        return NextResponse.json({ message: 'Failed to update goal' }, { status: 500 });
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<Goal> {

    // Extract and verify token
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('No token present in the request');
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    const user = jwt.decode(token, { json: true });
    if (!user) {
        console.error('Invalid token: unable to decode');
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    try {
        // Extract ID and request body
        const id = (await params).id;
        if (!id) throw new Error('No "id" parameter provided');
        await sql`DELETE FROM goals WHERE id = ${id} RETURNING *`;
        return NextResponse.json({message: 'success'}, {status: 200});
    } catch (error) {
        console.error('Error processing PATCH request:', error);
        return NextResponse.json({ message: 'Failed to delete goal' }, { status: 500 });
    }
}