import { apiResponse, ApprovalRequest } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<ApprovalRequest[]> {
    const {id} = await params;
    const {rows} = await sql`
        SELECT ar.*, s.name as student_name, l.start_time 
        FROM approval_requests AS ar 
        LEFT JOIN students AS s ON ar.student_id = s.id 
        LEFT JOIN logs AS l ON ar.log_id = l.id
        WHERE ar.teacher_id = ${id}`;
    if (!rows) return NextResponse.json({message: 'Error occured while creating approval reqest'}, {status: 500});
    return NextResponse.json({message: 'success', data: rows as ApprovalRequest[] || []})
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const body = await request.json();
    const {id} = await params;
    const {student_id, log_id, estimated_time, reason} = body;
    if (!student_id || !log_id || !estimated_time) {
        return NextResponse.json({message: 'Missing required arguments in body'}, {status: 400})
    }
    const {rows, rowCount} = await sql`INSERT INTO approval_requests (teacher_id, student_id, log_id, estimated_time, reason) VALUES (${id}, ${student_id}, ${log_id}, ${estimated_time}, ${reason}) RETURNING *`;
    if (rowCount == 0) return NextResponse.json({message: 'Error occured while creating approval reqest'}, {status: 500});
    revalidateTag(`approval_requests${id}`)
    return NextResponse.json({message: 'success', data: rows[0]}, {status: 200});
}