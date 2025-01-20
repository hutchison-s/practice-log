import { sql } from "@vercel/postgres";
import * as jose from 'jose';
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("Missing environment variable")

export async function POST(request: Request) {
    const body = await request.json();
    const {time, code} = body;
    const record = await sql`SELECT * FROM students WHERE code = ${code}`;
    if (record.rowCount != 1) {
        return new Response(JSON.stringify({message: 'no user found'}), {status: 401});
    }
    const recordDate = new Date(record.rows[0].created_at)
    const recordTime = recordDate.getTime()
    if (recordTime !== parseInt(time)) {
        return new Response(JSON.stringify({message: 'invalid login code'}), {status: 401});
    }
    const user = record.rows[0];

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new jose.SignJWT(
        { userId: user.id, code: code, name: user.name })
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1 day')
        .sign(secret);

    // Set the token in an HTTP-only, secure cookie
    const cookieOptions = [
        `HttpOnly`,              // Prevents JavaScript access to the cookie        
        `SameSite=Lax`,          // CSRF protection
        `Path=/`,                // Cookie is sent for all routes
        `Max-Age=3600`,          // Cookie expires in 1 hour
    ];
    // Ensures cookie is only sent over HTTPS (only in production)
    if (process.env.NODE_ENV === 'production') cookieOptions.push('Secure');

    // Return a response with the token set as a cookie
    return new Response(JSON.stringify({ message: 'success', data: {...user, role: 'student'} }), {
        status: 200,
        headers: {
            'Set-Cookie': `token=${token}; ${cookieOptions.join('; ')}`,
            'Content-Type': 'application/json',
        },
    });
}