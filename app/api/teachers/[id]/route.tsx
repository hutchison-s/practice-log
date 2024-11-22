import { apiResponse, User } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<User> {
    const id = (await params).id;
    const res = await sql`SELECT * FROM teachers WHERE id = ${id}`;
    if (res.rowCount != 1) {
        return NextResponse.json({message: 'no teachers to return'}, {status: 200});
    }
    return NextResponse.json({message: 'success', data: res.rows[0] as User});
}