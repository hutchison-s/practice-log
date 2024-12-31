'use client'

import { validateEmail, validateName, validatePassword } from "@/app/_functions/data_validation"
import { ChangeEvent, FormEventHandler, useState } from "react"
import { PrimaryButton } from "./Buttons"
import { ControlledInput } from "./ControlledInput"
import { useRouter } from "next/navigation"

type Credentials = {name: string, email: string, password: string}


function SignUpForm() {
    const [userInfo, setUserInfo] = useState<Credentials>({name: '', email: '', password: ''})
    const [statusMsg, setStatusMsg] = useState('');
    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e)=>{
        setStatusMsg('Creating account...')
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fetch('/api/auth/signup', {
            method: "POST", 
            body: fd
        })
        .then(res => res.json())
        .then(json => {
            if (!json.data.id) {
                setStatusMsg('Account creation failed: '+json.message);
            } else {
                setStatusMsg('Account creation successful')
                router.push(`/login`)
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
    <form onSubmit={handleSubmit} className="w-full max-w-[600px]">
        <ControlledInput 
            label='Name' 
            input_type='text' 
            value={userInfo.name} 
            onChange={handleChange}
            validator={validateName}
            required
            placeholder='e.g., Wolfgang Mozart...'
        />
        <ControlledInput 
            label='Email' 
            input_type='email' 
            value={userInfo.email} 
            onChange={handleChange}
            validator={validateEmail}
            required
            placeholder='e.g., wolfgang@gmail.com...'
        />
        <ControlledInput 
            label='Password' 
            input_type='password' 
            value={userInfo.password} 
            onChange={handleChange}
            validator={validatePassword}
            required
            placeholder='e.g., Super$ecret251...'
        />
        <p className="text-red-500 text-center"><small>{statusMsg}</small></p>
        <div className="flex justify-center">
            <PrimaryButton type="submit" onClick={undefined}>Create Account</PrimaryButton>
        </div>
    </form>
  )
}

export default SignUpForm