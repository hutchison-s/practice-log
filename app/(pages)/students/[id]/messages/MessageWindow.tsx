'use client'
import { useUser } from '@/app/_usercontext/useUser'
import { Message } from '@/app/types'
import { Send } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage';
import Elipsis from '@/app/ui/components/Elipsis';

function MessageWindow({messages}: {messages: Message[]}) {
    const {user} = useUser();
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null)
    const {id} = useParams<{ id: string }>();
    const router = useRouter();

    useEffect(()=>{
        if (chatRef.current) {
            chatRef.current.scrollTo({top: chatRef.current.scrollHeight, behavior: 'smooth'})
        }
    }, [messages.length])

    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const val = e.target.value;
        if (val.length >120) return;
        setContent(e.target.value);
    }
    const handleSend: MouseEventHandler<HTMLButtonElement> = (e) => {
        setIsSending(true)
        e.currentTarget.blur();
        fetch(`/api/students/${id}/messages`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({content})})
            .then(res => {
                if (res.ok) {
                    setContent('');
                    router.refresh();
                    setIsSending(false)
                }
            })
            .catch(err => {
                console.error(err);
            })
    } 
  return (
    <>
        <section className="w-full max-w-[600px] h-[60vh] py-4 px-2 rounded border-2 border-secondary overflow-auto md:px-8" ref={chatRef}>
            <div className='grid gap-4 w-full'>
                {messages.map(m => <ChatMessage key={m.id} message={m} isSender={m.sent_by == user.id}/>)}
            </div>
        </section>
        <div className='w-full max-w-[400px] flex gap-2 align-center justify-center my-2 relative overflow-hidden rounded-full group'>
            <input type="text" name="content" id="content" placeholder='New message...' autoComplete='off' className='flex-1 block bg-background border-2 border-lighter rounded-full px-4 py-2' onInput={handleInput} value={content}/>
            <button onClick={handleSend} className='min-w-12 bg-lighter absolute top-0 right-0 h-full w-fit p-2 pr-4 cursor-pointer group-focus-within:bg-primary group-active:bg-primary' >
                {isSending ? <Elipsis /> : <Send />}
            </button>
        </div>
    </>
  )
}

export default MessageWindow