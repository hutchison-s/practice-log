import { apiResponse, User } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<User> {
    try {
      const id = (await params).id;
      const token = request.cookies.get('token')?.value
      if (!token) return NextResponse.json({message: 'not authorized'}, {status: 401})
      const user = jwt.decode(token, {json: true});
      if (!user) return NextResponse.json({message: 'not authorized'}, {status: 401})
      
      const res = await sql`SELECT id, name, email, created_at FROM teachers WHERE id = ${id}`;
      if (res.rowCount != 1) {
          return NextResponse.json({message: 'no teachers to return'}, {status: 200});
      }
      return NextResponse.json({message: 'success', data: res.rows[0] as User});
    } catch (error) {
      console.error('Error retrieving teacher', error)
      return NextResponse.json({message: 'server error'}, {status: 500})
    }
}