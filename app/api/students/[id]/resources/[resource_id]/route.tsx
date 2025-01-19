import { userIs } from "@/app/api/helpers";
import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string, resource_id: string}>}
): apiResponse<Resource> {
    const {id, resource_id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('owner or teacher', {req_id: req_id, content_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const {rows} = await sql`SELECT * FROM resources WHERE id = ${resource_id}`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'No resource found'}, {status: 404})
    return NextResponse.json({message: 'success', data: rows[0] as Resource}, {status: 200})
}

export async function DELETE(
    request: NextRequest,
    {params}: {params: Promise<{id: string, resource_id: string}>}
): apiResponse<undefined> {
    try {
        const {id, resource_id} = await params;
        const req_id = request.headers.get('x-user-id')
        if (!(await userIs('teacher', {req_id: req_id, content_id: id}))) {
            return NextResponse.json({message: 'Access denied'}, {status: 403})
        }
        const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const {rows: keys} = await sql`SELECT key FROM resources WHERE id = ${resource_id}`;
        if (keys.length == 0) return NextResponse.json({message: 'Cannot delete resource.'}, {status: 403});
        await fetch(`${apiURL}/s3?file=${keys[0].key}`, {method: 'DELETE'})
        await sql`DELETE FROM resources WHERE id = ${resource_id} AND created_by = ${req_id}`;
        revalidatePath(`/api/students/${id}/resources`);
        revalidatePath(`/teachers/${req_id}`)
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'server error'}, {status: 500})
    }
}