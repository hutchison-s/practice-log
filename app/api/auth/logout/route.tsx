import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    (await cookies()).delete('token')

    // Clear the token cookie by setting its Max-Age to 0
    response.cookies.set('token', '', {
        maxAge: 0,               // Immediately expires the cookie
        path: '/',               // Clear the cookie for the entire site
        httpOnly: true,          // Ensure the cookie is HTTP-only for security
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'lax',         // Prevent CSRF attacks
    });

    return NextResponse.redirect(new URL('/login', request.url));
}