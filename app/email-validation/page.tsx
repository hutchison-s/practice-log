import React from 'react'
import PageTitle from '../ui/components/PageTitle';
import GlassDiv from '../ui/components/GlassDiv';
import SubHeading from '../ui/components/SubHeading';
import BodyText from '../ui/components/BodyText';
import { PrimaryLinkButton } from '../ui/components/Buttons';
import SmallPageWrapper from '../ui/components/SmallPageWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Email Validation",
    description: "Validate your Practice HQ account and start reaping the benefits of streamlined lessons studio management.",
  };

async function ValidationPage({searchParams}: {searchParams: Promise<{status: string, reason?: string}>}) {
    const {status, reason} = await searchParams;
  return (
    <SmallPageWrapper>
        <PageTitle>Account Validation</PageTitle>
        <GlassDiv className='max-w-[600px]'>
            <SubHeading className='text-center my-4'>{status.toUpperCase()}</SubHeading>
            {status == 'failure' && <BodyText className='text-center'>{reason}</BodyText>}
        </GlassDiv>
        <PrimaryLinkButton href={status == 'failure' ? 'mailto:hutchison.music@gmail.com?subject=Practice%20HQ%20Issue' : '/login'}>
            {status == 'failure'
                ? 'Email Site Admin'
                : 'Sign In'
            }
        </PrimaryLinkButton>
    </SmallPageWrapper>
  )
}

export default ValidationPage