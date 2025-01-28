import PageTitle from '@/app/_ui_components/layout/PageTitle'
import React from 'react'
import MessageWindow from './MessageWindow'
import { Metadata } from 'next'
import { Students } from '@/app/api/_controllers/studentController'

export const metadata: Metadata = {
  title: "Messages",
  description: "Practice HQ's built-in messaging platform that facilitates communication between lessons.",
};

async function Page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const messages = await Students.getAllMessages(id);
  return (
    <>
        <PageTitle>Messages</PageTitle>
        <MessageWindow messages={messages} />
    </>
  )
}

export default Page