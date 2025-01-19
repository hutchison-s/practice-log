import React from 'react'
import FeaturedText from '../layout/FeaturedText'

function Hero() {
  return (
    <section className='w-full text-center mt-12 mb-12'>
        <h2 className='-mb-4 font-golos font-bold text-[3.5rem] text-txtprimary text-shadow-xl zoom-in md:text-[7rem] md:-mb-12'>PRACTICE</h2>
        <p className='mb-10 font-inter text-[2.8rem] font-light bg-gradient-to-br from-cyan-500 to-teal-600 inline-block text-transparent bg-clip-text text-shadow zoom-in late md:text-[5.5rem]'>with Purpose</p>
        <FeaturedText className='late'>
        <strong className='text-txtprimary'>Practice HQ</strong> is the essential platform for connecting lessons&nbsp;and practice to drive measurable&nbsp;growth.
        </FeaturedText>

    </section>
  )
}

export default Hero