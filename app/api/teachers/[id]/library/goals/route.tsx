import { apiResponse, LibraryGoal } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<LibraryGoal[]> {
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id) throw new Error('No id parameter present');

        const {rows} = await sql`SELECT * FROM library_goals WHERE teacher_id = ${id}`;
        return NextResponse.json({message: 'Success', data: rows ? rows as LibraryGoal[] : []})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<LibraryGoal> {
    try {
        const {title, content} = await request.json();
        if (!title || !content) return NextResponse.json({message: 'Missing parameters required in request body'}, {status: 400})
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id) throw new Error('No id parameter present');
        
        const {rows} = await sql`INSERT INTO library_goals (title, content, teacher_id) VALUES (${title}, ${content}, ${id}) RETURNING *`;
        if (!rows || rows.length == 0) return NextResponse.json({message: "Could not add group"}, {status: 500})
        revalidatePath(`/teachers/${id}/library`)
        return NextResponse.json({message: 'Success', data: rows[0] as LibraryGoal}, {status: 201})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}