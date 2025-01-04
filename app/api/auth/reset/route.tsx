import { sendConfirmPasswordResetEmail, sendPasswordResetEmail } from "@/app/_emails/controller";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        if (!code) {
            console.error('No code present in search parameters.')
            return NextResponse.json({message: 'Missing required parameters'}, {status: 400});
        }
        const {password} = await request.json();
        if (!password) {
            console.error('No password present in request body.')
            return NextResponse.json({message: 'Missing required parameters'}, {status: 400});
        }
        const {rows} = await sql`
            SELECT 
                email, created_at 
            FROM 
                reset_codes 
            WHERE 
                code = ${code}`;
        if (!rows || rows.length == 0) {
            console.error('Invalid code provided.', code)
            return NextResponse.json({message: 'Invalid reset code'}, {status: 403});
        }
        const {email, created_at} = rows[0];
        if (Date.now() - new Date(created_at).getTime() > 1000 * 60 * 60 * 24) {
            console.error('Reset Link Expired');
            return NextResponse.json({message: 'Reset link is expired'}, {status: 403});
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
        const hashedPass = await bcrypt.hash(password, saltRounds);

        const {rows: teachers} = await sql`
            UPDATE 
                teachers 
            SET 
                password = ${hashedPass} 
            WHERE 
                email = ${email}
            RETURNING name`;
        if (!teachers || teachers.length == 0) {
            console.error(`User with email address ${email} does not exist and cannot be validated.`)
            return NextResponse.json({message: 'User no longer exists'}, {status: 403});
        }
        await sql`DELETE FROM reset_codes WHERE code = ${code}`;
        await sendConfirmPasswordResetEmail({name: teachers[0].name, email: email})
        return NextResponse.json({message: 'Success'}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Server error'}, {status: 500})
    }
}