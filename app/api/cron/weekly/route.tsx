import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('unauthorized attempt at cron job: secret', authHeader)
        return new NextResponse('Unauthorized', {
        status: 401,
        });
    }
    try {
        const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const {rows: teachers} = await sql<{id: string, name: string, email: string}>`SELECT teachers.id, teachers.name, teachers.email FROM teachers INNER JOIN account_preferences AS ap ON ap.user_id = teachers.id WHERE ap.reports = TRUE AND ap.report_frequency = 7`
        fetch(`${apiURL}/send_report`, {method: 'POST', headers: {"Content-Type": 'application/json', "authorization": `Bearer ${process.env.CRON_SECRET}`}, body: JSON.stringify({teachers})})
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'failure', error: error}, {status: 500})
    }
    
}