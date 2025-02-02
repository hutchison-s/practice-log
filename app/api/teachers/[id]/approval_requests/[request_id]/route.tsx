import { sql } from "@vercel/postgres";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, {params}: {params: Promise<{id: string, request_id: string}>}) {
    const {is_approved} = await request.json();
    const {request_id, id} = await params;
    
    const {rows: requests} = await sql`DELETE FROM approval_requests WHERE id = ${request_id} RETURNING *`;
    const {log_id, estimated_time} = requests[0];
    if (is_approved) {
        await sql`UPDATE logs SET is_approved = TRUE, total_time = ${estimated_time * 60} WHERE id = ${log_id}`
    } else {
        await sql`DELETE FROM logs WHERE id = ${log_id}`
    }

    revalidateTag(`approval_requests${id}`)

    return NextResponse.json({message: 'success'}, {status: 200})
}