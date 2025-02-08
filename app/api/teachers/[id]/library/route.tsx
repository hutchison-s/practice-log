import { apiResponse, Library, LibraryGoal, LibraryResource, Resource } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}): apiResponse<Library> {
    try {
        const id = (await params).id;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        if (!id) throw new Error('No id parameter present');

        const {rows: resources} = await sql<LibraryResource>`SELECT * FROM library_resources WHERE teacher_id = ${id}`;
        const {rows: goals} = await sql<LibraryGoal>`SELECT * FROM library_goals WHERE teacher_id = ${id}`;
        return NextResponse.json({message: 'Success', data: {resources: resources || [], goals: goals  || []}})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failure on server' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    try {
        const id = (await params).id;
        const {rows} = await sql<Resource>`SELECT * FROM resources WHERE created_by = ${id}`;
        await sql`INSERT INTO library_resources (title, type, key, url, teacher_id) VALUES ${rows.map(r => `(${r.title}, ${r.type}, ${r.key}, ${r.url}, ${r.created_by})`).join(', ')}`
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error occured: '+error}, {status: 500})
    }
}