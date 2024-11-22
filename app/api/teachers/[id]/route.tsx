import { sql } from "@vercel/postgres";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id;
    const res = await sql`SELECT * FROM teachers WHERE id = ${id}`;
    if (res.rowCount != 1) {
        return Response.json({});
    }
    return Response.json(res.rows[0]);
}