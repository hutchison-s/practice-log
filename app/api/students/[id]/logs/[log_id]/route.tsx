import { userIs } from "@/app/api/helpers";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string, log_id: string}>}) {
    const {id, log_id} = await params;
    const req_id = request.headers.get('x-user-id');
    if (!(await userIs('owner or teacher', {req_id: req_id, content_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    await sql`DELETE FROM logs WHERE id = ${log_id}`;
    revalidatePath(`/api/students/${id}/logs`)
    revalidatePath(`/teachers/${req_id}`)
    return NextResponse.json({message: 'success'}, {status: 200})
}