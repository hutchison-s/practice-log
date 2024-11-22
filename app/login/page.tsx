'use client'
import { FormEventHandler, useEffect, useRef, useState } from "react";
import PageTitle from "../ui/components/PageTitle";
import { PrimaryButton } from "../ui/components/Buttons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../_usercontext/useUser";
import { validateEmail, validatePassword } from "../_functions/data_validation";

export default function Page() {
    const [userInfo, setUserInfo] = useState<{email: string, password: string}>({email: '', password: ''})
    const [message, setMessage] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const {login} = useUser();
    const apiURL = process.env.NEXT_PUBLIC_API_URL_BASE;
    
    const handleChange: FormEventHandler<HTMLFormElement> = (e)=>{
        const changed = e.target as HTMLInputElement
        setUserInfo(prev => {
            return {
                ...prev,
                [changed.name]: changed.value
            }
        })
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e)=>{
        
        setMessage('Submitting...')
        const fd = new FormData(e.currentTarget);
        fetch(`${apiURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: fd.get('email'), password: fd.get('password')})
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    console.log('login failed');
                    setMessage(data.message);
                    throw new Error("could not login user")
                }
                else {
                    login(data.user);
                    document.cookie = `token=${data.token}; path=/; HttpOnly; Secure; SameSite=Strict`;
                    router.push(`/teachers/${data.user.id}`)
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(()=>{
        if (validateEmail(userInfo.email)) {
            emailRef.current?.classList.remove("border-red-500");
            emailRef.current?.classList.add("border-lighter");
        } else {
            emailRef.current?.classList.add("border-red-500");
            emailRef.current?.classList.remove("border-lighter");
        }
        if (validatePassword(userInfo.password)) {
            passRef.current?.classList.remove("border-red-500");
            passRef.current?.classList.add("border-lighter");
        } else {
            passRef.current?.classList.add("border-red-500");
            passRef.current?.classList.remove("border-lighter");
        }
        setMessage('')
    }, [userInfo.email, userInfo.password])

    

    return (
        <>
            <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
            <PageTitle>Log In</PageTitle>
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleSubmit(e);
                }} 
                onChange={(e)=>{
                    handleChange(e)
                }}
                className="py-4 px-2 w-full max-w-[500px] mx-auto">
                <label className="relative my-8 block w-full rounded group">
                    <span className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-secondary transition-all">Email: </span>
                    <input type="email" name='email' ref={emailRef} className='w-full p-2 border-2 border-red-500 rounded bg-black/50 focus:outline-none focus:bg-secondary'/>
                </label>
                <label className="relative my-8 block w-full rounded group">
                    <span className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-secondary transition-all">Password: </span>
                    <input type="password" name='password' ref={passRef} className='w-full p-2 border-2 border-red-500 rounded bg-black/50 focus:outline-none focus:bg-secondary'/>
                </label>
                <p className="text-red-500 text-center"><small>{message}</small></p>
                <div className="flex justify-center">
                    <PrimaryButton type="submit" onClick={undefined}>Log In</PrimaryButton>
                </div>
                
            </form>
            <div className="text-center leading-6">
                <p>Don&apos;t have an account yet?</p>
                <Link href={'/signup'} className="text-lighter underline">Create an Account</Link>
            </div>
            </main>
        </>
    )
}