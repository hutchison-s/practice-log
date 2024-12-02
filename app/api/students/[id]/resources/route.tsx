import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
): apiResponse<Resource[]> {
    const {id} = await params;
    if (!id) return NextResponse.json({message: 'Student ID parameter is required'}, {status: 400})
    const {rows} = await sql`SELECT * FROM resources WHERE student_id = ${id}`;
    return NextResponse.json({message: 'success', data: rows as Resource[]}, {status: 200})
}

