import BodyText from '@/app/ui/components/BodyText';
import { SecondaryLinkButton } from '@/app/ui/components/Buttons';
import FeaturedText from '@/app/ui/components/FeaturedText';
import GlassDiv from '@/app/ui/components/GlassDiv';
import PageTitle from '@/app/ui/components/PageTitle';
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper';
import React from 'react'
import DeleteButton from './DeleteButton';

async function ConfirmDelete({params}: {params: Promise<{id: string}>}) {
    const id = (await params).id;
  return (
    <SmallPageWrapper>
        <PageTitle>Delete Account</PageTitle>
        <GlassDiv className='p-4 mx-auto text-center grid place-items-center gap-8'>
            <FeaturedText>Are you sure you want to delete your account?</FeaturedText>
            <BodyText>Once deleted, all your studio data (students, resources, goals, etc.) will be permanently erased and cannot be recovered.</BodyText>
            <div className='w-full flex justify-evenly items-center flex-wrap gap-2 md:flex-nowrap'>
                <DeleteButton />
                <SecondaryLinkButton href={`/teachers/${id}`}>Cancel</SecondaryLinkButton>
            </div>
        </GlassDiv>
    </SmallPageWrapper>
  )
}

export default ConfirmDelete