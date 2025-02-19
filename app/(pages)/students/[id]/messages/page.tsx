import PageTitle from '@/app/_ui_components/layout/PageTitle'
import React from 'react'
import MessageWindow from './MessageWindow'
import { Metadata } from 'next'
import { Students } from '@/app/api/_controllers/studentController'
import { Teachers } from '@/app/api/_controllers/teacherController'

export const metadata: Metadata = {
  title: "Messages",
  description: "Practice HQ's built-in messaging platform that facilitates communication between lessons.",
};

async function Page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const student = await Students.getOneById(id);
  const messages = await Students.getAllMessages(id);
  const teacher = await Teachers.getOneById(student.teacher_id);
  return (
    <>
        <PageTitle>Messages</PageTitle>
        <MessageWindow teacher={teacher} student={student} messages={messages} />
    </>
  )
}

export default Page