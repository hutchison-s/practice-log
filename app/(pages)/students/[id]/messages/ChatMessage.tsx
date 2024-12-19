'use client'
import { utcToTimeZone } from '@/app/_functions/dates'
import { useUser } from '@/app/_usercontext/useUser'
import { Message } from '@/app/types'
import React, { useEffect } from 'react'

function ChatMessage({message, isSender}: {message: Message, isSender?: boolean}) {
    const {user} = useUser();
    const contentStyles = `chatMessage bg-${isSender ? 'secondary' : 'lighter'} grid text-${isSender ? 'right' : 'left'} min-w-40 max-w-[80%] h-fit rounded-lg py-2 px-4 text-${isSender ? 'txtprimary' : 'background'} justify-self-${isSender ? 'end' : 'start'}`;
    const timestampStyles = `text-[0.5rem] text-${isSender ? 'txtsecondary' : 'secondary'}`

    useEffect(()=>{
        if (message.is_read || user.id == message.sent_by) return;
        fetch(`/api/students/${message.student_id}/messages/${message.id}`, {method: 'POST'})
            .catch(err => {
                console.error("could not mark message as read.", err)
            })
    }, [])
  return (
    <div className={contentStyles}>
        <p>{message.content}</p>
        <span className={timestampStyles}>{utcToTimeZone(message.created_at)}</span>
    </div>
  )
}

export default ChatMessage