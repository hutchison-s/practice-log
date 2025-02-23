import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { apiResponse, Enrollee } from "@/app/types";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Enrollee[]> {    
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})

        if (!id) throw new Error('No id parameter present');
        const { rowCount, rows } = await sql`
        SELECT DISTINCT ON (s.id)
            s.id, 
            s.name, 
            s.code, 
            s.created_at, 
            s.updated_at, 
            s.teacher_id, 
            s.subject, 
            s.weekly_goal,
            s.day_of_week,
            s.time_of_day,
            s.group_id,
            s.duration,
            g.color as group_color,
            (SELECT EXISTS(SELECT 1 FROM messages WHERE student_id = s.id AND is_read = false AND sent_by = s.id)) as has_unread
        FROM 
            students AS s
        LEFT JOIN
            groups AS g ON g.id = s.group_id
        LEFT JOIN
            messages ON messages.student_id = s.id
        WHERE 
            s.teacher_id = ${id}
        `;
        return NextResponse.json({
            message: 'success', 
            data: rowCount && rowCount > 0 ? rows as Enrollee[]: []
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}
