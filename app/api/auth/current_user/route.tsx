import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { sql } from "@vercel/postgres";
import { defaultUser } from "@/app/_usercontext/UserContext";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return Response.json({message: 'no user', data: defaultUser}, {status: 403});
    const tokenUser = jwt.decode(token!.value, {json: true});
    if (!tokenUser) return Response.json({message: 'no user', data: defaultUser}, {status: 403});
    let query;
    if (tokenUser.email) {
        query = sql`SELECT * FROM teachers WHERE id = ${tokenUser.userId}`
    } else {
        query = sql`SELECT * FROM students WHERE id = ${tokenUser.userId}`
    }
    const {rows} = await query;
    if (rows.length == 0) return Response.json({message: 'no user', data: defaultUser}, {status: 403});
    return Response.json({message: 'success', data: rows[0]}, {status: 200});

}