import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { sql } from "@vercel/postgres";
import { defaultUser } from "@/app/_usercontext/UserContext";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return new Response(null, {status: 200})
    const tokenUser = jwt.decode(token!.value, {json: true});
    if (!tokenUser) return new Response(null, {status: 200});
    let query;
    if (tokenUser.email) {
        query = sql`SELECT * FROM teachers WHERE id = ${tokenUser.userId}`
    } else {
        query = sql`SELECT * FROM students WHERE id = ${tokenUser.userId}`
    }
    const {rows} = await query;
    if (rows.length == 0) return new Response(JSON.stringify(defaultUser), {status: 200});
    return new Response(JSON.stringify(rows[0]), {status: 200})

}