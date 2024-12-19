import { fetchJSONWithToken } from '@/app/AuthHandler'
import { Message } from '@/app/types'
import PageTitle from '@/app/ui/components/PageTitle'
import React from 'react'
import MessageWindow from './MessageWindow'

async function Page({params}: {params: Promise<{id: string}>}) {
  const id = (await params).id
  const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {data: messages} = await fetchJSONWithToken<Message[]>(`${apiURL}/students/${id}/messages`);
  return (
    <>
        <PageTitle>Messages</PageTitle>
        <MessageWindow messages={messages || []} />
    </>
  )
}

export default Page