'use client'
import React, { use, useEffect } from 'react'
import { useUser } from '../_usercontext/useUser';
import { useRouter } from 'next/navigation';



function Page(props: {searchParams: Promise<{code: string, time: string}>}) {
    const searchParams = use(props.searchParams);
    const {time, code} = searchParams;
    const router = useRouter();
    const {login} = useUser();
    const apiURL = process.env.NEXT_PUBLIC_API_URL_BASE;

    useEffect(()=>{
        const go = async () => {
        fetch(`${apiURL}/auth/qr`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({time, code})})
            .then(async res => {
                if (res.ok) {
                    const data = await res.json();
                    login(data.user);
                    router.push(`/students/${data.user.id}/log`);
                }
            })
            .catch(error => {
                console.error(error);
                router.push('/fail')
            })
        }
        go();
    }, [apiURL, code, login, router, time])


  return (
    <div>Attempting login</div>
  )
}

export default Page