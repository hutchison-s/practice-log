import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string, resource_id: string}>}) {
    try {
        const {id, resource_id} = await params;
        const req_id = request.headers.get('x-user-id');
        if (!req_id || id != req_id) return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
        await sql`DELETE FROM library_resources WHERE id = ${resource_id}`;
        revalidatePath(`/teachers/${id}/library`)
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: 'server error'}, {status: 500})
    }

}