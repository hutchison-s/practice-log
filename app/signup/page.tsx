'use client'
import { FormEventHandler, useEffect, useRef, useState } from "react";
import PageTitle from "../ui/components/PageTitle";
import { PrimaryButton } from "../ui/components/Buttons";
import { useRouter } from "next/navigation";
import { validateEmail, validateName, validatePassword } from "../_functions/data_validation";


export default function Page() {
    const [userInfo, setUserInfo] = useState<{email: string, password: string, name: string}>({name: '', email: '', password: ''})
    const [message, setMessage] = useState("");
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    
    
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
        fetch(`/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: fd.get('email'), name: fd.get('name'), password: fd.get('password')})
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    console.log('creation failed');
                    setMessage(data.message);
                    throw new Error("could not create user")
                } else {
                    router.push('/login')
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
        if (validateName(userInfo.name)) {
            nameRef.current?.classList.remove("border-red-500");
            nameRef.current?.classList.add("border-lighter");
        } else {
            nameRef.current?.classList.add("border-red-500");
            nameRef.current?.classList.remove("border-lighter");
        }
        setMessage('')
    }, [userInfo.email, userInfo.password, userInfo.name])

    

    return (
        <>
            <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
            <PageTitle>Create new Account</PageTitle>
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleSubmit(e);
                }} 
                onChange={(e)=>{
                    handleChange(e)
                }}
                className="py-4 px-2 grid gap-8 w-full">
                <label className="relative w-full group">
                    <span className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-secondary transition-all">Name: </span>
                    <input type="text" name='name' ref={nameRef} className='w-full p-2 border-2 border-red-500 rounded bg-transparent focus:outline-none focus:bg-secondary'/>
                </label>
                <label className="relative w-full group">
                    <span className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-secondary transition-all">Email: </span>
                    <input type="email" name='email' ref={emailRef} className='w-full p-2 border-2 border-red-500 rounded bg-transparent focus:outline-none focus:bg-secondary'/>
                </label>
                <label className="relative w-full group">
                    <span className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-secondary transition-all">Password: </span>
                    <input type="password" name='password' ref={passRef} className='w-full p-2 border-2 border-red-500 rounded bg-transparent focus:outline-none focus:bg-secondary'/>
                </label>
                <p className="text-red-500 text-center"><small>{message}</small></p>
                <div className="flex justify-center">
                    <PrimaryButton type="submit" onClick={undefined}>Create</PrimaryButton>
                </div>
                
            </form>
            </main>
        </>
    )
}