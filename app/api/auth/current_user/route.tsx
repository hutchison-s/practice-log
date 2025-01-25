import { cookies } from "next/headers";
import { sql } from "@vercel/postgres";
import { verifyToken } from "../../helpers";
import { defaultUser } from "@/app/_contexts/UserContext";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) {
        console.log('No token present. User not logged in.');
        return Response.json({message: 'no user', data: defaultUser}, {status: 403});
    }
    const tokenUser = await verifyToken(token.value)
    if (!tokenUser) {
        console.log('Invalid token. User not logged in.');
        return Response.json({message: 'no user', data: defaultUser}, {status: 403});
    }
    let query;
    if (tokenUser.email) {
        query = sql`SELECT * FROM teachers WHERE id = ${tokenUser.userId}`
    } else {
        query = sql`SELECT * FROM students WHERE id = ${tokenUser.userId}`
    }
    const {rows, rowCount} = await query;
    if (rowCount == 0) {
        console.log('User does not exist in database. User not logged in.');
        return Response.json({message: 'no user', data: defaultUser}, {status: 403});
    }
    console.log(rows[0].name, 'logged in successfully');
    return Response.json({message: 'success', data: rows[0]}, {status: 200});

}