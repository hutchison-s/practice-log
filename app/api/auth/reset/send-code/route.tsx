import { sendPasswordResetEmail } from "@/app/_emails/controller";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const fd= await request.formData();
    const email = fd.get('email') as string
    if (!email) return NextResponse.redirect(new URL('/password-reset/failed?reason='+encodeURIComponent("Invalid or missing email"), request.url))
    const {rows: teachers} = await sql`
        SELECT 
            name
        FROM 
            teachers 
        WHERE 
            email = ${email}
    `;
    if (!teachers || teachers.length == 0) return NextResponse.redirect(new URL('/password-reset/failed?reason='+encodeURIComponent("User does not exist"), request.url))
    await sendPasswordResetEmail({name: teachers[0].name, email: email});
    return NextResponse.redirect(new URL('/password-reset/sent', request.url));
}