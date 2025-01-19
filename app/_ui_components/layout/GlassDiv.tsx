import React from 'react'

function GlassDiv({children, className}: {children: React.ReactNode, className?: string}) {
  return (
    <div className={'w-full p-4 rounded-xl glass '+className}>
        {children}
    </div>
  )
}

export default GlassDiv