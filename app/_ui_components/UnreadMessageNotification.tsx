'use client'

import { fetchUnreadMessages } from '@/app/(pages)/teachers/[id]/actions';
import { AlertCircle, Loader, MessageCircle, MessageCircleWarning } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function UnreadMessageNotification({student_id, size}: {student_id: string, size: number}) {
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        fetchUnreadMessages(student_id)
            .then(count => {
                if (count == 0) {
                    return;
                }
                setHasNewMessage(true)
            })
            .catch (reason => {
                console.error(reason);
                setHasError(true);
            })
            .finally(()=>setIsLoading(false))
    }, [])
  return (
    isLoading
        ?   <Loader className='spinner' size={size}/>
        :   hasError
            ?   <AlertCircle color='black' size={size} />
            :   hasNewMessage ? <MessageCircleWarning size={size} className='animate-bounce text-white'/> : <MessageCircle size={size} className='text-teal-500 transition-all hover:text-teal-300 hover:scale-105'/>
            
  )
}

export default UnreadMessageNotification