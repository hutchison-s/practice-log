import React from 'react'

function IconListItem({icon, children}: {icon: React.ReactNode, children: React.ReactNode}) {
  return (
    <div className="w-full max-w-[600px] mx-auto my-2">
    <div className='flex ml-8 gap-2 align-center justify-start'>
        <div className='text-lighter'>{icon}</div>
        <p className='text-txtprimary text-lg'>{children}</p>
    </div>
  </div>
  )
}

export default IconListItem