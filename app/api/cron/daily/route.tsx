import { sendWeeklyReport } from "@/app/_utils/emails/controller";
import { NextRequest, NextResponse } from "next/server";
import { Teachers } from "../../_controllers/teacherController";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('unauthorized attempt at cron job: secret', authHeader)
        return new NextResponse('Unauthorized', {
        status: 401,
        });
    }
    try {
        // const teachers = await getTeachersForWeeklyReport();
        const teachers = [await Teachers.getOneById(6)]
        console.log(`sending report to ${teachers?.length} teachers for weekly cron job.`)
        await sendWeeklyReport(teachers.map(t => {return {id: t.id, name: t.name, email: t.email!}}));
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'failure', error: error}, {status: 500})
    }
    
}