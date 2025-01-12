import { userIs } from "@/app/api/helpers";
import { apiResponse } from "@/app/types";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;
 
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const req_id = request.headers.get('x-user-id');
    if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    if (!id) return NextResponse.json({message: 'Invalid URL'}, {status: 404})
    const { searchParams } = request.nextUrl;

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    // Validate date formats
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json({ message: 'Invalid startDate format' }, { status: 400 });
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json({ message: 'Invalid endDate format' }, { status: 400 });
    }

    // Validate limit format
    if (limit && (!/^\d+$/.test(limit) || parseInt(limit, 10) <= 0)) {
      return NextResponse.json({ message: 'Invalid limit parameter' }, { status: 400 });
    }

    const query = sql`
      SELECT 
        logs.*,
        s.name
      FROM 
        logs
      LEFT JOIN
        students AS s ON s.id = student_id
      WHERE
        student_id = ${id}
        AND
        start_time >= ${startDate ? startDate : '2025-01-01'}
        AND
        start_time <= ${endDate ? endDate : new Date().toISOString()}
      ORDER BY 
        start_time ASC
      LIMIT 
        ${limit ? parseInt(limit) : 1000}
    `
    const { rows } = await query;
    return NextResponse.json({ message: 'success', data: rows }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Server error. Could not query practice logs.' },
      { status: 500 }
    );
  }
}

  export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<{log_id: string, start_time: string}> {
    
    const {id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('student', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const insertResponse = await sql`INSERT INTO logs (student_id) VALUES (${id}) RETURNING *`;
    const newLog = insertResponse.rows[0];
    return NextResponse.json({message: 'Success', data: {log_id: newLog.id, start_time: newLog.start_time}});
  }

  export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<{log_id: string}> {
    const body = await request.json();
    const {id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('student', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const {log_id, journal} = body;
    console.log('updating log', log_id, journal)
    await sql`UPDATE logs SET total_time = 0, journal = ${journal} WHERE id = ${log_id}`;
    revalidatePath(`/students/${id}`);
    revalidatePath(`/api/students/${id}`);
    return NextResponse.json({message: 'Success', data: {log_id: log_id}});
  }