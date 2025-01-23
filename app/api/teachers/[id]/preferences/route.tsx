import { apiResponse, NotificationSettings } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<NotificationSettings> {
    const {id} = await params;
    const req_id = request.headers.get('x-user-id');
    if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})

    const {rows, rowCount} = await sql`SELECT messages, approvals, reports, report_frequency FROM account_preferences WHERE user_id = ${id}`;
    if (rowCount == 0) return NextResponse.json({message: 'No user found'}, {status: 400});
    return NextResponse.json({message: 'success', data: rows[0] as NotificationSettings})
}

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<NotificationSettings> {
    const {id} = await params;
    const {messages, approvals, reports, report_frequency} = await request.json();
    const req_id = request.headers.get('x-user-id');
    if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
    const {rows, rowCount} = await sql`UPDATE account_preferences SET messages = ${messages}, approvals = ${approvals}, reports = ${reports}, report_frequency = ${report_frequency} WHERE user_id = ${id} RETURNING messages, approvals, reports, report_frequency`;
    if (rowCount == 0) return NextResponse.json({message: 'No user found'}, {status: 400});
    revalidatePath(`/teachers/${id}/account`)
    return NextResponse.json({message: 'success', data: rows[0] as NotificationSettings})
}