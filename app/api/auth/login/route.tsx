import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

export async function POST(request: Request) {
    const fd = await request.formData();
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;

    // Check if the user exists
    const existingUsers = await sql`SELECT id, name, password FROM teachers WHERE email = ${email}`;
    if (existingUsers.rowCount === 0) {
        return Response.json({ message: 'No user found' }, { status: 401 });
    }

    const user = existingUsers.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: email, name: user.name },
        jwtSecret,
        { expiresIn: '1h' } // Set token expiration time
    );

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
    return new Response(JSON.stringify({ message: 'success', data: { id: user.id, name: user.name, email } }), {
        status: 200,
        headers: {
            'Set-Cookie': `token=${token}; ${cookieOptions.join('; ')}`,
            'Content-Type': 'application/json',
        },
    });
}
