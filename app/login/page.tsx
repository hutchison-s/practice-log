import PageTitle from "../ui/components/PageTitle";

export default function Page() {
    return (
        <>
            <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
            <PageTitle>Login</PageTitle>
            <p>Teacher: Google</p>
            <p>Student: QR scan</p>
            </main>
        </>
    )
}