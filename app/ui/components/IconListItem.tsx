import React from 'react'

function IconListItem({icon, children}: {icon: React.ReactNode, children: React.ReactNode}) {
  return (
    <li className='w-full max-w-[600px] mx-auto my-4 flex gap-2 align-center justify-start'>
        <div className='text-teal-500'>{icon}</div>
        <p className='text-zinc-400 text-lg'>{children}</p>
    </li>
  )
}

export default IconListItem