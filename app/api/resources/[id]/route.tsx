import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
): apiResponse<Resource> {
    const {id} = await params;
    if (!id) return NextResponse.json({message: 'ID parameter is required'}, {status: 400})
    const {rows} = await sql`SELECT * FROM resources WHERE id = ${id}`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'No resource found'}, {status: 400})
    return NextResponse.json({message: 'success', data: rows[0] as Resource}, {status: 200})
}

export async function DELETE(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
): apiResponse<undefined> {
    const {id} = await params;
    if (!id) return NextResponse.json({message: 'ID parameter is required'}, {status: 400})
    try {
        const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const {data: resource}: {data: Resource} = await (await fetch(`${apiURL}/resources/${id}`)).json();
        await fetch(`${apiURL}/s3?file=${resource.key}`, {method: 'DELETE'})
        await sql`DELETE FROM resources WHERE id = ${id}`;
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'server error'}, {status: 500})
    }
}