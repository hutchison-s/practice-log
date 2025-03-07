'use client'

import {useUser} from '../../_hooks/useUser'
import { PrimaryLinkButton, SecondaryLinkButton } from "../layout/Buttons";


function PortalLink() {
    const {user} = useUser();
  return (
    <section className="text-center grid gap-4">
      <div className="w-full max-w-[600px] grid gap-4 justify-center">
      {user.id 
        ? <PrimaryLinkButton href={`/${user?.email ? 'teachers' : 'students'}/${user.id}`} >Go to Portal</PrimaryLinkButton> 
        : <PrimaryLinkButton
              href="/login"
              size="md"
            >
              Get Started!
            </PrimaryLinkButton>
        }
        <SecondaryLinkButton
        href="/about"
        size='md'
      >
        Learn More
      </SecondaryLinkButton>
      </div>
    </section>
  )
}

export default PortalLink