import { sendPasswordResetEmail } from "@/app/_emails/controller";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const fd = await request.formData();
    const email = fd.get('email') as string
    if (!email) return NextResponse.json({message:"Invalid or missing email"}, {status: 400})
    const {rows: teachers} = await sql`
        SELECT 
            name
        FROM 
            teachers 
        WHERE 
            email = ${email}
    `;
    if (!teachers || teachers.length == 0) return NextResponse.json({message:"User does not exist"}, {status: 403})
    await sendPasswordResetEmail({name: teachers[0].name, email: email});
    return NextResponse.json({message: 'Success'}, {status: 200});
}