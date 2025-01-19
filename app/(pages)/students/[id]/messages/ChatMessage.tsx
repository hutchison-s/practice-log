'use client'
import { utcToTimeZone } from '@/app/_utils/dates'
import { useUser } from '@/app/_hooks/useUser'
import { Message } from '@/app/types'
import React, { useEffect } from 'react'

function ChatMessage({message, isSender}: {message: Message, isSender?: boolean}) {
    const {user} = useUser();
    const wrapperStyles = `w-full flex`
    const contentStyles = `chatMessage ${isSender ? 'sender' : 'receiver'} glass grid min-w-32 max-w-[80%] rounded-lg py-2 px-4 `;
    const timestampStyles = `text-[0.5rem] text-zinc-400`

    useEffect(()=>{
        if (message.is_read || user.id == message.sent_by) return;
        fetch(`/api/students/${message.student_id}/messages/${message.id}`, {method: 'POST'})
            .catch(err => {
                console.error("could not mark message as read.", err)
            })
    }, [])
  return (
    <div className={wrapperStyles} style={{justifyContent: isSender ? 'flex-end' : 'flex-start'}}>
        <div className={contentStyles} style={{textAlign: isSender ? 'right' : 'left'}}>
          <p>{message.content}</p>
          <span className={timestampStyles}>{utcToTimeZone(message.created_at)}</span>
        </div>
    </div>
  )
}

export default ChatMessage