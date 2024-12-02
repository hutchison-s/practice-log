import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
): apiResponse<Resource[]> {
    const limit = request.nextUrl.searchParams.get('limit');
    const {id} = await params;
    if (!id) return NextResponse.json({message: 'Student ID parameter is required'}, {status: 400})
    const query = limit ? sql`SELECT * FROM resources WHERE student_id = ${id} ORDER BY created_at DESC LIMIT ${limit}` : sql`SELECT * FROM resources WHERE student_id = ${id} ORDER BY created_at DESC`
    const {rows} = await query;
    return NextResponse.json({message: 'success', data: rows as Resource[]}, {status: 200})
}

