import { QueryResult, QueryResultRow, sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const revalidate = 60;
 
type logRow = {
  log_id: number,
  student_id: number,
  name: string,
  start: string,
  seconds: number
}
// type Student = {
//   id: number,
//   name: string,
//   created_at: string,
//   updated_at: string,
//   code: string
// }
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
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
      return new Response(
        JSON.stringify({ message: "Start a practice session!" }),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ message: "Keep it up!", data: rows }),
      { status: 200 }
    );
  }

  export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
    const insertResponse = await sql`INSERT INTO logs (student_id) VALUES (${id}) RETURNING id`;
    const newId = insertResponse.rows[0].id;
    return Response.json({message: 'Success', log_id: newId});
  }

  export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
    const {log_id, journal} = await request.json();
    await sql`UPDATE logs SET total_time = 0, journal = ${journal} WHERE id = ${log_id}`;
    revalidatePath(`/students/${id}/log`);
    return Response.json({message: 'Success', log_id: log_id});
  }