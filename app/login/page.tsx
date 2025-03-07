import PageTitle from "../_ui_components/layout/PageTitle";
import Link from "next/link";
import LoginForm from "../_ui_components/forms/LoginForm";
import SmallPageWrapper from "../_ui_components/layout/SmallPageWrapper";
import BodyText from "../_ui_components/layout/BodyText";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to Practice HQ and get back to motivating and monitoring student progress.",
  };

export default async function Page() {

    return (
        <>
            <SmallPageWrapper>
                <PageTitle>Sign In</PageTitle>
                <Suspense fallback={<Loader size={80} className="mx-auto my-4 text-teal-500"/>}>
                    <LoginForm />
                </Suspense>
                <div className="text-center leading-6">
                    <p>Don&apos;t have an account yet?</p>
                    <Link href={'/signup'} className="text-lighter underline">Create an Account</Link>
                    <BodyText className="text-sm mt-8"><Link href='/password-reset' className="underline">Forgot Password?</Link></BodyText>
                </div>
            </SmallPageWrapper>
        </>
    )
}