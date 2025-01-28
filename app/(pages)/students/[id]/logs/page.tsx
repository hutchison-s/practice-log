import PageTitle from "@/app/_ui_components/layout/PageTitle";
import FilteredLogList from "./FilteredLogList";
import FeaturedText from "@/app/_ui_components/layout/FeaturedText";
import { Metadata } from "next";
import { StudentModel } from "@/app/api/_controllers/studentController";

export const metadata: Metadata = {
    title: "Practice Logs",
    description: "View student practice logs, weekly summaries, and filter by date for specific reports.",
  };

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const student = await StudentModel(id);
    const weeks = await student.getWeekTotals();
    const logs = await student.getLogs();
    return (
        <>
            <PageTitle>Student Practice Logs</PageTitle>
            <FeaturedText>{student?.name}&apos;s {student?.subject} lessons</FeaturedText>
            <FilteredLogList weekly_goal={student?.weekly_goal || 0} weeks={weeks} logs={logs} />

            
        </>
    )
}