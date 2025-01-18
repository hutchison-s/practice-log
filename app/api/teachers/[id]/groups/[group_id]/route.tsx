import { apiResponse, Group } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string, group_id: string}>}): apiResponse<Group> {
    try {
        const {id, group_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id || !group_id) throw new Error('No id parameter present');

        const {rows} = await sql`SELECT * FROM groups WHERE id = ${group_id}`;
        if (!rows || rows.length == 0) return NextResponse.json({message: "Could not find group"}, {status: 500})
        return NextResponse.json({message: 'Success', data: rows[0] as Group}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string, group_id: string}>}): apiResponse<Group> {
    try {
        const {group_name, color} = await request.json();
        if (!group_name || !color) return NextResponse.json({message: 'Group Name and Color are required in request body'}, {status: 400})
        const {id, group_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id || !group_id) throw new Error('No id parameter present');
        
        const {rows} = await sql`UPDATE groups SET name = ${group_name}, color = ${color} WHERE id = ${group_id} RETURNING *`;
        if (!rows || rows.length == 0) return NextResponse.json({message: "Could not update group"}, {status: 500})
        revalidatePath(`/teachers/${id}`)
        return NextResponse.json({message: 'Success', data: rows[0] as Group}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string, group_id: string}>}): apiResponse<Group> {
    try {
        const {id, group_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id || !group_id) throw new Error('No id parameter present');

        await sql`UPDATE students SET group_id = NULL WHERE group_id = ${group_id}`;
        
        const {rows} = await sql`DELETE FROM groups WHERE id = ${group_id} RETURNING *`;
        if (!rows || rows.length == 0) return NextResponse.json({message: "Could not delete group"}, {status: 500})
        revalidatePath(`/teachers/${id}`)
        return NextResponse.json({message: 'Success', data: rows[0] as Group}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}