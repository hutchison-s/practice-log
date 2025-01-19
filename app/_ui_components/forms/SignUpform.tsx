'use client'

import { validateEmail, validateName, validatePassword } from "@/app/_utils/data_validation"
import { ChangeEvent, FormEventHandler, useState } from "react"
import { PrimaryButton } from "../layout/Buttons"
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
        if (!validateEmail(fd.get('email') as string)) {
            return setStatusMsg('Invalid email address format')
        }
        if (!validatePassword(fd.get('password') as string)) {
            return setStatusMsg('Password must be at least 8 characters long and include at least one of each of the following: lowercase letter, UPPERCASE LETTER, number, and a special character !@#$%^&*()?')
        }
        if (!validateName(fd.get('name') as string)) {
            return setStatusMsg('Invalid name format. Please include your first and last name.')
        }
        fetch('/api/auth/signup', {
            method: "POST", 
            body: fd
        })
        .then(res => res.json())
        .then(json => {
            if (!json.data || !json.data.id) {
                setStatusMsg('Account creation failed: '+json.message);
            } else {
                setStatusMsg('Account creation successful')
                router.push(`/signup/success`)
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
        <p className="text-cyan-500 text-center my-8"><small>{statusMsg}</small></p>
        <div className="flex justify-center">
            <PrimaryButton type="submit" onClick={undefined}>Create Account</PrimaryButton>
        </div>
    </form>
  )
}

export default SignUpForm