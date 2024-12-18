
import PageTitle from "../ui/components/PageTitle";
import SignUpForm from "../ui/components/SignUpform";


export default function Page() {

    

    return (
        <>
            <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
            <PageTitle>Sign Up</PageTitle>
            <SignUpForm />
            </main>
        </>
    )
}