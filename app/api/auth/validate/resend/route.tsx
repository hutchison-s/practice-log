import { sendValidationEmail } from "@/app/_emails/controller";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const emailParam = searchParams.get('email');
        if (!emailParam) {
            console.error('No email present in search parameters.')
            return NextResponse.json({message:'No email provided'}, {status: 400})
        }
        const email = decodeURIComponent(emailParam as string);

        const {rows: teachers} = await sql`
            SELECT
                validated
            FROM 
                teachers 
            WHERE 
                email = ${email}`;
        if (!teachers || teachers.length == 0) {
            console.error(`User with email address ${email} does not exist and cannot be validated.`)
            return NextResponse.json({message:'Cannot resend validation to that email address.'}, {status: 400})
        }
        if (teachers[0].validated == true) {
            return NextResponse.json({message:'User is already validated'}, {status: 400})
        }

        await sql`
            DELETE FROM 
                validations 
            WHERE 
                email = ${email}`;
        
        await sendValidationEmail({email, name: teachers[0].name});
        return NextResponse.json({message: 'success'}, {status: 200});
    } catch (error) {
        console.error(error)
        return NextResponse.json({message:'Server error. Could not resend link.'}, {status: 500})
    }

   
}