'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import SmallPageWrapper from '../ui/components/SmallPageWrapper'
import PageTitle from '../ui/components/PageTitle'
import GlassDiv from '../ui/components/GlassDiv'
import { PrimaryButton } from '../ui/components/Buttons';
import { CircleCheck } from 'lucide-react'

function RequestReset() {
    const [isSent, setIsSent] = useState(false);
    const [hasError, setHasError] = useState('');

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        fetch(`/api/auth/reset/send-code`, {method: 'POST', body: new FormData(e.currentTarget)})
            .then(async (res) => {
                if (!res.ok) {
                    const {message} = await res.json();
                    console.error(message)
                    setHasError(message);
                }
                setIsSent(true);
            }).catch(err => console.error(err))
    }

    useEffect(()=>{

    }, [])

  return (
    <SmallPageWrapper>
        <PageTitle>Request Password Reset</PageTitle>
        <GlassDiv>
            <form onSubmit={handleSubmit} className='mx-auto p-4 max-w-[500px] grid place-items-center gap-2 text-center'>
            <p>Enter the email address associated with your account and we will send you a link to reset your password.</p>
            <label className="relative my-8 block w-full rounded group">
        <span 
            className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-background transition-all"
        >
            Email: 
        </span>
        <input
            type='email'
            name='email'
            placeholder='beethoven@symphony.com...'
            required
            className='w-full p-2 border-2 rounded bg-transparent focus:outline-none focus:bg-background'
        />
    </label>
    {hasError && <p className='text-sm text-center my-4'>{hasError}</p>}
    {isSent && <p className='flex gap-2'><CircleCheck className='text-teal-500'/> Link has been sent to your email address</p>}
    <PrimaryButton type='submit' onClick={undefined}>Send Email</PrimaryButton>
            </form>
        </GlassDiv>
    </SmallPageWrapper>
  )
}

export default RequestReset