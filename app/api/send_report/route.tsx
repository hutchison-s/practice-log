import { sendWeeklyReport } from "@/app/_utils/emails/controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('unauthorized attempt to send report. triggered by cron.')
        return new NextResponse('Unauthorized', {
        status: 401,
        });
    }
    try {
        const {teachers}: {teachers: {id: string, name: string, email: string}[]} = await request.json();
        
        await sendWeeklyReport(teachers);
        return new NextResponse('Sending reports', {status: 200})
    } catch (error) {
        console.log('Error sending reports:', error);
        return new NextResponse('Sending reports failed', {status: 500})
    }
}