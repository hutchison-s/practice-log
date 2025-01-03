import { userIs } from "@/app/api/helpers";
import { apiResponse, logRow } from "@/app/types";
import { QueryResult, sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;
 
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): apiResponse<logRow[]> {
    const {id} = await params;
    const req_id = request.headers.get('x-user-id')
    if (!(await userIs('student or teacher', {user_id: req_id, student_id: id}))) {
        return NextResponse.json({message: 'Access denied'}, {status: 403})
    }
    const limit = request.nextUrl.searchParams.get('limit')
    let query: Promise<QueryResult>;
    if (limit) {
      query = sql`
      SELECT 
        log.id AS log_id,
        s.id AS student_id, 
        s.name AS name, 
        log.start_time AS start, 
        log.total_time AS seconds,
        log.journal as journal 
      FROM 
        students AS s 
      JOIN 
        logs as log ON log.student_id = s.id 
      WHERE s.id = ${id}
      ORDER BY
        log.start_time DESC
      LIMIT ${limit}`;
    } else {
      query = sql`
      SELECT 
        log.id AS log_id,
        s.id AS student_id, 
        s.name AS name, 
        log.start_time AS start, 
        log.total_time AS seconds,
        log.journal as journal 
      FROM 
        students AS s 
      JOIN 
        logs as log ON log.student_id = s.id 
      WHERE s.id = ${id}
      ORDER BY
        log.start_time DESC`;
    }
    const {rows}: {rows: logRow[]} = (await query);
    if (rows.length === 0) {
      return NextResponse.json({ message: "Start a practice session!" },
        { status: 200 }
      );
    }
    return NextResponse.json({message: "Keep it up!", data: rows },
      { status: 200 }
    );
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