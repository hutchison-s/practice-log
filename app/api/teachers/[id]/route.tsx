import { apiResponse, User } from "@/app/types";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { userIs } from "../../helpers";
import { sendConfirmDeletedAccountEmail } from "@/app/_emails/controller";

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

export async function DELETE(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
      const id = (await params).id;
      const req_id = request.headers.get('x-user-id');
      if (id !== req_id) {
          return NextResponse.json({message: 'You do not have access to this content. Please login and try again.'}, {status: 403})
      }
      const {rows: teachers} = await sql`
          DELETE 
          FROM 
              teachers 
          WHERE 
              id = ${id}
          RETURNING
              name, email
      `;
      if (!teachers || teachers.length == 0) return NextResponse.json({message:"User does not exist"}, {status: 403})
      await sendConfirmDeletedAccountEmail({name: teachers[0].name, email: teachers[0].email});
      return NextResponse.json({message: 'Success'}, {status: 200});
  } catch (error) {
    console.error(error)
      return NextResponse.json({message: 'Could not process delete request'}, {status: 500})
  }
}