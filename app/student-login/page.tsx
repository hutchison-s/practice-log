'use client'
import React, { use, useEffect } from 'react'
import { useUser } from '../_usercontext/useUser';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';



function Page(props: {searchParams: Promise<{code: string, time: string}>}) {
    const searchParams = use(props.searchParams);
    const {time, code} = searchParams;
    const router = useRouter();
    const {login} = useUser();
    

    useEffect(()=>{
        const go = async () => {
        fetch(`/api/auth/qr`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({time, code})})
            .then(async res => {
                if (res.ok) {
                    console.log('response received', res.statusText)
                    const data = await res.json();
                    console.log('qr response:', data)
                    login(data.user);
                    console.log('redirecting')
                    router.push(`/students/${data.user.id}/log`);
                }
            })
            .catch(error => {
                console.error(error);
                router.push('/fail')
            })
        }
        go();
    }, [code, login, router, time])


  return (
    <>
        <div>Attempting login</div>
        <div className="w-full min-h-80">
            <Loader2 size={120} className='spinner' />
        </div>
    </>
  )
}

export default Page