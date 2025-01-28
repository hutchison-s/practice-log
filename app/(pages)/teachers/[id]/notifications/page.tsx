import PageTitle from '@/app/_ui_components/layout/PageTitle';
import SubHeading from '@/app/_ui_components/layout/SubHeading';
import React from 'react'
import LogApprovalManager from '../_components/LogApprovalManager';
import { Metadata } from 'next';
import { Teachers } from '@/app/api/_controllers/teacherController';

export const metadata: Metadata = {
  title: "Notifications",
  description: "Address student concerns and approve unusual practice sessions quickly in the notifications page.",
};

async function NotificationsPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const logApprovals = await Teachers.getApprovalRequests(id);
    
  return (
    <>
            <PageTitle>Teacher Notifications</PageTitle>
            <SubHeading>Approval Requests</SubHeading>
            <LogApprovalManager requests={logApprovals} />
            
            {/* <SubHeading>New Messages</SubHeading>
            <SubHeading>Students who could use a nudge</SubHeading> */}
    </>
  )
}

export default NotificationsPage