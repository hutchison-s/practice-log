'use client'
import { validatePassword } from '@/app/_functions/data_validation'
import BodyText from '@/app/ui/components/BodyText'
import { PrimaryButton } from '@/app/ui/components/Buttons'
import { ControlledInput } from '@/app/ui/components/ControlledInput'
import GlassDiv from '@/app/ui/components/GlassDiv'
import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
import { Loader } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { validateCode } from './actions'
import { useUser } from '@/app/_usercontext/useUser'

function ResetPassword() {
    const {code} = useParams();
    const {logout} = useUser();
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hasError, setHasError] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isValidCode, setIsValidCode] = useState(true)
    const router = useRouter();

    async function handleSend() {
        if (password !== confirmPassword) {
            return setHasError('Passwords do not match. Try again.')
        }
        if (!validatePassword(password)) {
            return setHasError('Password must be at least 8 characters long and include at least one of each of the following: lowercase letter, UPPERCASE LETTER, number, and a special character !@#$%^&*()?')
        }
        setIsSending(true)
            fetch(`/api/auth/reset?code=${code}`, {method: 'POST', headers: {'content-type': 'application/json', 'accept': 'application/json'}, body: JSON.stringify({password})})
                .then(async res => {
                    if (!res.ok) {
                        setIsSending(false);
                        const message = (await res.json()).message
                        console.error(message)
                        setHasError('Could not reset password')
                    } else {
                        setIsSending(false);
                        logout();
                        router.push('/password-reset/success')
                    }
                })
    }

    useEffect(()=>{
        setIsSending(false);
        setHasError('')
    }, [password])

    useEffect(()=>{
        const getCodeValidity = async ()=>{
            try {
                const valid = await validateCode(code as string);
                setIsValidCode(valid);
                setIsLoading(false)   
            } catch (error) {
                console.error(error);
                setIsValidCode(false)
            }
        }

        getCodeValidity()
    }, [])

  return (
    isValidCode
        ?   <SmallPageWrapper>
                <PageTitle>Password Reset</PageTitle>
                <BodyText className='text-center'>Choose a new password below</BodyText>
                <GlassDiv className='grid place-items-center max-w-[800px]'>
                    {isLoading
                        ? <Loader className='spinner' size={100}/>
                        : <div className='max-w-[500px] mx-auto grid place-items-center gap-2'>
                        <ControlledInput input_type='password' label='Password' validator={validatePassword} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <ControlledInput input_type='password' label='Confirm' validator={validatePassword} value={password} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        <PrimaryButton onClick={handleSend}>{isSending ? <Loader className='spinner'/> : 'Reset Password'}</PrimaryButton>
                        {hasError && <p className='text-sm text-teal-500 my-4 text-center'>{hasError}</p>}
                        <BodyText className='text-center text-sm'>Your old password will not work after you click this button.</BodyText>
                    </div>}
                    
                </GlassDiv>
            </SmallPageWrapper>
        : <SmallPageWrapper>
            <PageTitle>Invalid Reset Code</PageTitle>
            <GlassDiv className='max-w-[500px]'>
                <BodyText className='text-center'>Code may be expired or entered incorrectly</BodyText>
            </GlassDiv>
        </SmallPageWrapper>
  )
}

export default ResetPassword