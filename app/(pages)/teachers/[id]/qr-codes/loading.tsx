import { Loader } from 'lucide-react'
import React from 'react'

function LoadingQRCodes() {
  return (
    <div className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
        <Loader aria-label="Loader" size={200} className='spinner'/>
    </div>
  )
}

export default LoadingQRCodes