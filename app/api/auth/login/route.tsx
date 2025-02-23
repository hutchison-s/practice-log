import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';
import * as jose from 'jose'

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

export async function POST(request: Request) {
    const fd = await request.formData();
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;

    const existingUsers = await sql`SELECT id, name, password, validated, timezone FROM teachers WHERE email = ${email}`;
    if (!existingUsers || existingUsers.rows.length === 0) {
        return Response.json({ message: 'No user found' }, { status: 401 });
    }

    const user = existingUsers.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new jose.SignJWT(
        { userId: user.id, email: email, name: user.name, isVerified: user.validated, timezone: user.timezone })
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1 day')
        .sign(secret);

    const cookieOptions = [
        `HttpOnly`,              
        `SameSite=Lax`,          
        `Path=/`,                
        `Max-Age=86400`,          
    ];
    // Ensures cookie is only sent over HTTPS (only in production)
    if (process.env.NODE_ENV === 'production') cookieOptions.push('Secure');

    return new Response(JSON.stringify({ message: 'success', data: { id: user.id, name: user.name, email: email, role: 'teacher', isVerified: user.validated, timezone: user.timezone } }), {
        status: 200,
        headers: {
            'Set-Cookie': `token=${token}; ${cookieOptions.join('; ')}`,
            'Content-Type': 'application/json',
        },
    });
}
