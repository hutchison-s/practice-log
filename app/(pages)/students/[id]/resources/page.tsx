import PageTitle from "@/app/_ui_components/layout/PageTitle"
import FilteredResourceList from "./FilteredResourceList";
import { Metadata } from "next";
import { Students } from "@/app/api/_controllers/studentController";

export const metadata: Metadata = {
    title: "Resources",
    description: "Quick and easy access to resources shared by the teacher. Quick links to all PDFs, images, videos, audio recordings and more.",
  };

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const resources = await Students.getResources(id);
    return (
        <>
            <PageTitle>Student Resources</PageTitle>
            
            <FilteredResourceList resources={resources} student_id={id} />

        </>
    )
}