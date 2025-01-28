import { getTeachersForWeeklyReport, sendWeeklyReport } from "@/app/_utils/emails/controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', {
        status: 401,
        });
    }
    try {
        const teachers = await getTeachersForWeeklyReport();
        await sendWeeklyReport(teachers || []);
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'failure', error: error}, {status: 500})
    }
    
}