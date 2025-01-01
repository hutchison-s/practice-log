import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './app/api/helpers';


export async function middleware(request: NextRequest) {
    console.log('middleware engaged', request.nextUrl.pathname)
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({message: 'Please log in to continue.'}, {status: 401})
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
        return NextResponse.json({message: 'You do not have access to this content. Please check your login status and try again.', error}, {status: 403});
    }
}

export const config = {
    matcher: [
        '/api/s3/:path*',
        '/api/students/:path*',
        '/api/teachers/:path*',
    ],
};
