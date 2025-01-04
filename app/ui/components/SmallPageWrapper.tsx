import React from 'react'

function SmallPageWrapper({children}: {children: React.ReactNode}) {
  return (
    <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 pb-8 pt-8 md:px-20 md:pt-32">
        {children}
    </main>
  )
}

export default SmallPageWrapper