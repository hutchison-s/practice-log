import { apiResponse, User } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { userIs } from "../../helpers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<User> {
    try {
      const id = (await params).id;
      const req_id = request.headers.get('x-user-id');
      if (!await userIs('student or teacher', {user_id: id, student_id: req_id})) {
          return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
      }
      const res = await sql`SELECT id, name, email, created_at FROM teachers WHERE id = ${id}`;
      if (res.rowCount != 1) {
          return NextResponse.json({message: 'no teachers to return'}, {status: 404});
      }
      
      
      return NextResponse.json({message: 'success', data: res.rows[0] as User});
    } catch (error) {
      console.error('Error retrieving teacher', error)
      return NextResponse.json({message: 'server error'}, {status: 500})
    }
}