import React from 'react'
import SmallPageWrapper from '../ui/components/SmallPageWrapper'
import PageTitle from '../ui/components/PageTitle'
import GlassDiv from '../ui/components/GlassDiv'
import { PrimaryButton } from '../ui/components/Buttons';

function RequestReset() {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    <SmallPageWrapper>
        <PageTitle>Request Password Reset</PageTitle>
        <GlassDiv>
            <form action={`${apiURL}/auth/reset/send-code`} method="post" className='mx-auto p-4 max-w-[500px] grid place-items-center gap-2 text-center'>
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
    <PrimaryButton type='submit' onClick={undefined}>Send Email</PrimaryButton>
            </form>
        </GlassDiv>
    </SmallPageWrapper>
  )
}

export default RequestReset