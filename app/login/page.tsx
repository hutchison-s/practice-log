import PageTitle from "../ui/components/PageTitle";
import Link from "next/link";
import LoginForm from "../ui/components/LoginForm";

export default function Page() {

    

    return (
        <>
            <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
            <PageTitle>Log In</PageTitle>
            <LoginForm />
            <div className="text-center leading-6">
                <p>Don&apos;t have an account yet?</p>
                <Link href={'/signup'} className="text-lighter underline">Create an Account</Link>
            </div>
            </main>
        </>
    )
}