import PageTitle from "../ui/components/PageTitle";
import Link from "next/link";
import LoginForm from "../ui/components/LoginForm";
import SmallPageWrapper from "../ui/components/SmallPageWrapper";
import BodyText from "../ui/components/BodyText";

export default function Page() {

    

    return (
        <>
            <SmallPageWrapper>
                <PageTitle>Sign In</PageTitle>
                <LoginForm />
                <div className="text-center leading-6">
                    <p>Don&apos;t have an account yet?</p>
                    <Link href={'/signup'} className="text-lighter underline">Create an Account</Link>
                    <BodyText className="text-sm mt-8"><Link href='/password-reset' className="underline">Forgot Password?</Link></BodyText>
                </div>
            </SmallPageWrapper>
        </>
    )
}