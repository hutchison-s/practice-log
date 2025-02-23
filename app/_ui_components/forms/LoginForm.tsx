'use client'

import { validateEmail, validatePassword } from "@/app/_utils/data_validation"
import { ChangeEvent, FormEventHandler, useState } from "react"
import { PrimaryButton, SecondaryButton, SecondaryLinkButton } from "../layout/Buttons"
import { ControlledInput } from "./ControlledInput"
import { useUser } from "@/app/_hooks/useUser"
import { useRouter, useSearchParams } from "next/navigation"

type Credentials = {email: string, password: string}


function LoginForm() {
    const [userInfo, setUserInfo] = useState<Credentials>({email: '', password: ''})
    const [statusMsg, setStatusMsg] = useState('');
    const router = useRouter();
    const queries = useSearchParams();
    const {login, user, logout} = useUser();

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e)=>{
        setStatusMsg('Submitting credentials...')
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fetch('/api/auth/login', {
            method: "POST", 
            body: fd
        })
        .then(res => res.json())
        .then(json => {
            if (!json.data || !json.data.id) {
                return setStatusMsg('Login failed: '+json.message);
            } else if (!json.data.isVerified) {
                return setStatusMsg('Account needs validation. Check your email.')
            } else {
                setStatusMsg('Login successful')
                login(json.data);
                const intended = queries.get('callback')
                return router.push(intended ?? `/teachers/${json.data.id}`)
            }
        })
        .catch(err => {
            console.log(err);
            setStatusMsg('Invalid credentials')
        })

    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{setUserInfo(prev =>{
        return {
            ...prev,
            [e.target.name]: e.target.value
        }
    })}

    const handleLogout = ()=>{
        fetch('/api/auth/logout')
        logout()
        router.refresh();
    }



  return (
    user.id
    ? <><p>Logged in as {user.name}</p><p><em className="text-txtsecondary">{user.email}</em></p><SecondaryButton onClick={handleLogout}>Log out</SecondaryButton></>
    : <form onSubmit={handleSubmit} className="w-full max-w-[500px]">
        <ControlledInput 
            label='Email' 
            input_type='email' 
            value={userInfo.email} 
            onChange={handleChange}
            validator={validateEmail}
            required
            placeholder="e.g., wolfgang@gmail.com"
        />
        <ControlledInput 
            label='Password' 
            input_type='password' 
            value={userInfo.password} 
            onChange={handleChange}
            validator={validatePassword}
            required
            placeholder="e.g., Super$ecret251"
        />
        <p className="text-cyan-500 text-center"><small>{statusMsg}</small></p>
        {statusMsg == 'Account needs validation. Check your email.' && <div className="flex justify-center"><SecondaryLinkButton className="mx-auto my-8" size='sm' href='/email-validation/resend'>Resend Link</SecondaryLinkButton></div>}
        <div className="flex justify-center">
            <PrimaryButton type="submit" onClick={undefined}>Sign In</PrimaryButton>
        </div>
    </form>
  )
}

export default LoginForm