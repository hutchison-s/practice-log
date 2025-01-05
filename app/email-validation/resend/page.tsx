'use client'
import { validateEmail } from '@/app/_functions/data_validation'
import BodyText from '@/app/ui/components/BodyText'
import { PrimaryButton } from '@/app/ui/components/Buttons'
import { ControlledInput } from '@/app/ui/components/ControlledInput'
import GlassDiv from '@/app/ui/components/GlassDiv'
import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
import { CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function ResendValidation() {
    const searchParams = useSearchParams();
    const isExpired = searchParams.get('expired')
    const [email, setEmail] = useState('')
    const [isSent, setIsSent] = useState(false)
    const [hasError, setHasError] = useState('')

    async function handleSend() {
            fetch(`/api/auth/validate/resend?email=${email}`)
                .then(async res => {
                    if (!res.ok) {
                        const message = (await res.json()).message
                        console.error(message)
                        setHasError('Could not resend link')
                    } else {
                        setIsSent(true)
                    }
                })
    }

    useEffect(()=>{
        setHasError('')
    }, [email])

  return (
    <SmallPageWrapper>
        <PageTitle>Resend Validation Link</PageTitle>
        <BodyText className='text-center'>{isExpired == 'true' ? "It looks like your link is expired." : "Can't find your validation link?" }</BodyText>
        <BodyText className='text-center'>Enter your email address below to receive a new account validation email.</BodyText>
        <GlassDiv className='grid place-items-center max-w-[600px]'>
            <ControlledInput input_type='email' label='Email' validator={validateEmail} value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <PrimaryButton onClick={handleSend} disabled={isSent}>Resend Link</PrimaryButton>
            {hasError && <p className='text-sm text-teal-500 my-4 text-center'>{hasError}</p>}
            {isSent 
                ? <BodyText className='text-center text-teal-500 flex items-center justify-center my-4 gap-2 flex-wrap md:flex-nowrap'><CheckCircle className='text-teal-500 text-xl'/> <span className='text-sm'>Check your email for the new link.</span></BodyText> 
                : <BodyText className='text-center text-sm my-4'>Your old validation link will be inactive after you click this button.</BodyText>
            }
            
        </GlassDiv>
        
        
        
    </SmallPageWrapper>
  )
}

export default ResendValidation