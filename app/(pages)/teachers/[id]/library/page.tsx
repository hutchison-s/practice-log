import PageTitle from "@/app/_ui_components/layout/PageTitle";
import SubHeading from "@/app/_ui_components/layout/SubHeading";
import { Teachers } from "@/app/api/_controllers/teacherController";
import TransferButton from "../_components/TransferButton";

export default async function LibraryPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const {resources, goals} = await Teachers.getLibrary(id);

    return (
        <>
            <PageTitle>Library</PageTitle>
            <SubHeading>Resources</SubHeading>
            <ul>
                {resources.map(r => <li key={r.id}>{r.title}</li>)}
            </ul>
            <SubHeading>Goals</SubHeading>
            <ul>
                {goals.map(g => <li key={g.id}>{g.title}</li>)}
            </ul>
            <TransferButton />
        </>
    )
}