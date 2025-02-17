import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './app/api/helpers';

const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.log('no token present')
        return NextResponse.redirect(`${siteURL}/login`);
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
        const payload = await verifyToken(token);
        const req_id = payload ? payload.userId : ''

        const response = NextResponse.next();
        response.headers.set('x-user-id', req_id);
        return response;
    } catch (error) {
        console.error(error)
        return NextResponse.redirect(`${siteURL}/login`);
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
