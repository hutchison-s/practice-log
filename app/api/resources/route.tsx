import { apiResponse, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(
    request: NextRequest
): apiResponse<Resource> {
    const {url, resource_type, student_id, title, key} = await request.json();
    if (!url || !resource_type || !student_id || !title || !key) return NextResponse.json({message: 'Missing paramters from body'}, {status: 400})

    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) {
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const {rows} = await sql`INSERT INTO resources (url, type, student_id, title, key) VALUES(${url}, ${resource_type}, ${student_id}, ${title}, ${key}) RETURNING *`;
    if (!rows || rows.length == 0) return NextResponse.json({message: 'Insert failed'}, {status: 400})
    revalidatePath(`/students/${student_id}`);
    revalidatePath(`/teachers/${user.userId}`);
    return NextResponse.json({message: 'success', data: rows[0] as Resource}, {status: 200})
}