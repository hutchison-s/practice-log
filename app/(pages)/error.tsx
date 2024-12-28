'use client'
import BodyText from '@/app/ui/components/BodyText'
import { PrimaryButton, PrimaryLinkButton } from '@/app/ui/components/Buttons'
import PageTitle from '@/app/ui/components/PageTitle'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary:", error)
  }, [error])
  if (error.message == 'Unauthorized' || error.message == '401') {
    return (
      <>
        <PageTitle>Login Required</PageTitle>
        <BodyText className='text-center'>Your account credentials don&apos;t allow you to view this content. If you are not logged in, please do so and try again. If you are logged in, ensure you are logged in with the correct account.</BodyText>
        <PrimaryLinkButton href='/login'>Login</PrimaryLinkButton>
      </>
    )
  } else if (error.message == '404') {
    return (
      <>
        <PageTitle>Page Not Found</PageTitle>
        <BodyText className='text-center'>We couldn&apos;t find the page you&apos;re looking for.</BodyText>
        <PrimaryLinkButton href='/'>Return to Home Page</PrimaryLinkButton>
      </>
    )
  } else {
    return (
      <>
        <PageTitle>Error</PageTitle>
        <BodyText className='text-center'>An error occured loading content. Please try again.</BodyText>
        <BodyText>{error.message}</BodyText>
        <div className="grid place-items-center">
          <PrimaryButton onClick={reset}>Try again</PrimaryButton>
        </div>
      </>
    )
  }
  
}