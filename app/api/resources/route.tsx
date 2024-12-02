import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
): apiResponse<Resource> {
    const {url, resource_type, student_id, title, key} = await request.json();
    if (!url || !resource_type || !student_id || !title || !key) return NextResponse.json({message: 'Missing paramters from body'}, {status: 400})
    const {rows} = await sql`INSERT INTO resources (url, type, student_id, title, key) VALUES(${url}, ${resource_type}, ${student_id}, ${title}, ${key}) RETURNING *`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'Insert failed'}, {status: 400})
    return NextResponse.json({message: 'success', data: rows[0] as Resource}, {status: 200})
}