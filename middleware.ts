import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './app/api/helpers';
import { cookies } from 'next/headers';

// const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export async function middleware(request: NextRequest) {
    (await cookies()).delete('x-intended');
    try {
        const tokenCookie = request.cookies.get('token');
        if (!tokenCookie) throw new Error('No token present. Redirecting to login.')
        const token = tokenCookie?.value;
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
        const payload = await verifyToken(token!);
        const req_id = payload ? payload.userId : ''

        const response = NextResponse.next();
        response.headers.set('x-user-id', req_id);
        return response;
    } catch (error) {
        console.error(error)
        const response = NextResponse.redirect(new URL('/login?callback='+request.url, request.url))
        return response;
    }
}

export const config = {
    matcher: [
        '/api/s3/:path*',
        '/api/students/:path*',
        '/api/teachers/:path*',
        '/students/:path*',
        '/teachers/:path*'
    ],
};
