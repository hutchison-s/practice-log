import PageTitle from "@/app/_ui_components/layout/PageTitle";
import SubHeading from "@/app/_ui_components/layout/SubHeading";
import { Teachers } from "@/app/api/_controllers/teacherController";
import LibraryGoalDisplay from "./_components/LibraryGoalDisplay";
import LibraryResourceDisplay from "./_components/LibraryResourceDisplay";
import GlassDiv from "@/app/_ui_components/layout/GlassDiv";
import { StudentProvider } from "./_components/StudentContext";
import { GroupProvider } from "./_components/GroupContext";

export default async function LibraryPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const {resources, goals} = await Teachers.getLibrary(id);

    return (
        <>
            <PageTitle>Teacher Library</PageTitle>
            <StudentProvider>
                <GroupProvider>
                    <section className="w-full max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                        <GlassDiv>
                            <SubHeading>Resources</SubHeading>
                            <ul className="w-full max-w-[600px] grid gap-1">
                                {resources.map(r => <LibraryResourceDisplay r={r} key={r.id} />)}
                            </ul>
                        </GlassDiv>
                        <GlassDiv>
                            <SubHeading>Goals</SubHeading>
                            <ul className="w-full max-w-[600px] grid gap-1">
                                {goals.map(g => <LibraryGoalDisplay goal={g} key={g.id} />)}
                            </ul>
                        </GlassDiv>
                    </section>
                </GroupProvider>
            </StudentProvider>
            
        </>
    )
}