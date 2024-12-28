'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function PrintQRCode() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') as string;
    useEffect(()=>{
        if (!url) return;
        window.print();
        window.close();
    }, [url])
  return (

        url && <Image src={url} alt='QR Code Failed' width={300} height={400}/>

  )
}

export default PrintQRCode