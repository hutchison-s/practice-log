import { getTeachersForWeeklyReport, sendWeeklyReport } from "@/app/_utils/emails/controller";
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
        const teachers = await getTeachersForWeeklyReport();
        console.log(`sending report to ${teachers?.length} teachers for weekly cron.`)
        await sendWeeklyReport(teachers || []);
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'failure', error: error}, {status: 500})
    }
    
}