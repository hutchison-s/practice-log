import { sendWelcomeEmail } from "@/app/_emails/controller";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        if (!code) {
            console.error('No code present in search parameters.')
            return NextResponse.redirect(new URL('/email-validation?status=failure&reason='+encodeURIComponent('No code was present in the url link. Contact site administrator.'), request.url));
        }
        const {rows} = await sql`
            SELECT 
                email, created_at 
            FROM 
                validations 
            WHERE 
                code = ${code}`;
        if (!rows || rows.length == 0) {
            console.error('Code provided does not match any existing database records.', code)
            return NextResponse.redirect(new URL('/email-validation?status=failure&reason='+encodeURIComponent('Invalid email validation code. Code may be expired.'), request.url));
        }
        console.log(rows[0])
        const {email, created_at} = rows[0];
        if (Date.now() - new Date(created_at).getTime() > 1000 * 60 * 60 * 24) {
            console.error('Validation Link Expired');
            return NextResponse.redirect(new URL('/email-validation/resend?expired=true', request.url))
        }

        const {rows: teachers} = await sql`
            UPDATE 
                teachers 
            SET 
                validated = TRUE 
            WHERE 
                email = ${email}
            RETURNING name`;
        if (!teachers || teachers.length == 0) {
            console.error(`User with email address ${email} does not exist and cannot be validated.`)
            return NextResponse.redirect(new URL('/email-validation?status=failure&reason='+encodeURIComponent('User does not exist and cannot be validated. Contact site administrator.'), request.url));
        }
        await sql`DELETE FROM validations WHERE code = ${code}`;
        await sendWelcomeEmail({email, name: teachers[0].name});
        return NextResponse.redirect(new URL('/email-validation?status=success', request.url));
    } catch (error) {
        console.error(error)
        return NextResponse.redirect(new URL('/email-validation?status=failure&reason='+encodeURIComponent('Server error occurred while trying to validate email address. Contact site administrator.'), request.url));
    }

   
}