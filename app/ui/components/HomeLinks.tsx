'use client'

import {useUser} from '../../_usercontext/useUser'
import { PrimaryLinkButton } from "./Buttons";
import FeaturedText from './FeaturedText';
import HoverLink from './HoverLink';


function PortalLink() {
    const {user} = useUser();
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL_BASE;
  return (
    <section className="my-6 text-center grid gap-4">
      <FeaturedText>{user.id ? 'Welcome Back!' : 'Get Started!'}</FeaturedText>
      <div className="w-full max-w-[600px] flex gap-4 justify-center">
      {user.id 
        ? <PrimaryLinkButton href={`${siteURL}/${user?.email ? 'teachers' : 'students'}/${user.id}`} className='w-40'>Portal</PrimaryLinkButton> 
        : <PrimaryLinkButton
              href="/login"
              size="md"
              className="w-40"
            >
              Login
            </PrimaryLinkButton>
        }
        <HoverLink
        href="/about"
        className="w-40 border-2 rounded border-secondary"
      >
        Learn More
      </HoverLink>
      </div>
    </section>
  )
}

export default PortalLink