import { apiResponse, Group } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Group[]> {
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id) throw new Error('No id parameter present');

        const {rows} = await sql`SELECT * FROM groups WHERE teacher_id = ${id}`;
        return NextResponse.json({message: 'Success', data: rows ? rows as Group[] : []})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Group> {
    try {
        const {group_name, color} = await request.json();
        if (!group_name || !color) return NextResponse.json({message: 'Group Name and Color are required in request body'}, {status: 400})
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id) throw new Error('No id parameter present');
        
        const {rows} = await sql`INSERT INTO groups (name, color, teacher_id) VALUES (${group_name}, ${color}, ${id}) RETURNING *`;
        if (!rows || rows.length == 0) return NextResponse.json({message: "Could not add group"}, {status: 500})
        revalidatePath(`/teachers/${id}`)
        return NextResponse.json({message: 'Success', data: rows[0] as Group}, {status: 201})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}

