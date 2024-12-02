import React, { Suspense } from 'react'

function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <Suspense>
        {children}
    </Suspense>
  )
}

export default Layout