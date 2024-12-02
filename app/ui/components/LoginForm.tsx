'use client'

import { validateEmail, validatePassword } from "@/app/_functions/data_validation"
import { ChangeEvent, FormEventHandler, useState } from "react"
import { PrimaryButton } from "./Buttons"
import { ControlledInput } from "./ControlledInput"
import { useUser } from "@/app/_usercontext/useUser"
import { useRouter } from "next/navigation"

type Credentials = {email: string, password: string}


function LoginForm() {
    const [userInfo, setUserInfo] = useState<Credentials>({email: '', password: ''})
    const [statusMsg, setStatusMsg] = useState('');
    const router = useRouter();
    const {login} = useUser();

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
            if (!json.data.id) {
                setStatusMsg('Login failed: '+json.message);
            } else {
                setStatusMsg('Login successful')
                login(json.data);
                router.push(`/teachers/${json.data.id}`)
            }
        })
        .catch(err => {
            console.log(err);
            setStatusMsg('Error occurred: '+err)
        })

    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{setUserInfo(prev =>{
        return {
            ...prev,
            [e.target.name]: e.target.value
        }
    })}

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[500px]">
        <ControlledInput 
            label='Email' 
            input_type='email' 
            value={userInfo.email} 
            onChange={handleChange}
            validator={validateEmail}
        />
        <ControlledInput 
            label='Password' 
            input_type='password' 
            value={userInfo.password} 
            onChange={handleChange}
            validator={validatePassword}
        />
        <p className="text-red-500 text-center"><small>{statusMsg}</small></p>
        <div className="flex justify-center">
            <PrimaryButton type="submit" onClick={undefined}>Log In</PrimaryButton>
        </div>
    </form>
  )
}

export default LoginForm