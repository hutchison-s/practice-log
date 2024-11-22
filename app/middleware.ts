import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

const protectedRoutes = ['/students', '/teachers', '/api/students']

export async function middleware(request: NextRequest) {
    const cookies = request.cookies;
    const token = cookies.get('token')?.value;
    const pathName = request.nextUrl.pathname;

    if (protectedRoutes.some(route => pathName.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    
        try {
            jwt.verify(token, jwtSecret);
            return NextResponse.next();
        } catch (error) {
            return new Response(JSON.stringify({ message: 'Invalid token', error: error }), { status: 401 });
        }
    }
    return NextResponse.next();
    
}

export const config = {
    matcher: ['/students/:path*', '/teachers/:path*'],
};