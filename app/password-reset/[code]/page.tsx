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

function ResetPassword() {
    const {code} = useParams();
    if (!code) throw new Error('Invalid reset code')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hasError, setHasError] = useState('')
    const [isSending, setIsSending] = useState(false)
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
                        return router.push('/password-reset/success');
                    }
                })
    }

    useEffect(()=>{
        setIsSending(false);
        setHasError('')
    }, [password])

  return (
    <SmallPageWrapper>
        <PageTitle>Password Reset</PageTitle>
        <BodyText className='text-center'>Choose a new password below</BodyText>
        <GlassDiv className='grid place-items-center max-w-[800px]'>
            <div className='max-w-[500px] mx-auto grid place-items-center gap-2'>
                <ControlledInput input_type='password' label='Password' validator={validatePassword} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <ControlledInput input_type='password' label='Confirm' validator={validatePassword} value={password} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                <PrimaryButton onClick={handleSend}>{isSending ? <Loader className='spinner'/> : 'Reset Password'}</PrimaryButton>
                {hasError && <p className='text-sm text-teal-500 my-4 text-center'>{hasError}</p>}
                <BodyText className='text-center text-sm'>Your old password will not work after you click this button.</BodyText>
            </div>
            
        </GlassDiv>
        
        
        
    </SmallPageWrapper>
  )
}

export default ResetPassword