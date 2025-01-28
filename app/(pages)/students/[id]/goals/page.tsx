import GoalsList from "@/app/_ui_components/object_display/GoalsList";
import PageTitle from "@/app/_ui_components/layout/PageTitle";
import SubHeading from "@/app/_ui_components/layout/SubHeading";
import { Metadata } from "next";
import { Students } from "@/app/api/_controllers/studentController";

export const metadata: Metadata = {
    title: "Goals",
    description: "View student goals, both active and completed.",
  };


export default async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const goals = await Students.getGoals(id);
    return (
        <>
            <PageTitle>Student Goals</PageTitle>
            <SubHeading>Active</SubHeading>
            <GoalsList goals={goals?.filter(g => !g.is_complete) || []} isStudentView/>
            <SubHeading>Completed</SubHeading>
            <GoalsList goals={goals?.filter(g => g.is_complete) || []} isStudentView/>
        </>
    )
}