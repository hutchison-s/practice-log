import { userIs } from "@/app/api/helpers";
import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
): apiResponse<Resource[]> {
    const limit = request.nextUrl.searchParams.get('limit');
    const {id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const query = limit 
        ? sql`
            SELECT * 
            FROM resources 
            WHERE student_id = ${id} 
            ORDER BY created_at DESC LIMIT ${limit}`
        : sql`
            SELECT * 
            FROM resources 
            WHERE student_id = ${id} 
            ORDER BY created_at DESC`
    const {rows} = await query;
    return NextResponse.json({message: 'success', data: rows as Resource[]}, {status: 200})
}

export async function POST(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
): apiResponse<Resource> {
    const {url, resource_type, title, key} = await request.json();
    if (!url || !resource_type || !title || !key) return NextResponse.json({message: 'Missing paramters from body'}, {status: 400})
    const {id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('teacher', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const {rows} = await sql`INSERT INTO resources (url, type, student_id, title, key, created_by) VALUES(${url}, ${resource_type}, ${id}, ${title}, ${key}, ${req_id}) RETURNING *`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'Insert failed'}, {status: 500})
    revalidatePath(`/students/${id}`);
    revalidatePath(`/teachers/${req_id}`);
    return NextResponse.json({message: 'success', data: rows[0] as Resource}, {status: 201})
}
