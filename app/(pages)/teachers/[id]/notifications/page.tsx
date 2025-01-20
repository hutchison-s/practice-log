import PageTitle from '@/app/_ui_components/layout/PageTitle';
import SubHeading from '@/app/_ui_components/layout/SubHeading';
import React from 'react'
import { fetchLogApprovals } from '../actions';
import LogApprovalManager from '../_components/LogApprovalManager';

async function NotificationsPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const logApprovals = await fetchLogApprovals(id);
    
  return (
    <>
            <PageTitle>Teacher Notifications</PageTitle>
            <SubHeading>Log Approvals</SubHeading>
            <LogApprovalManager requests={logApprovals} />
            
            {/* <SubHeading>New Messages</SubHeading>
            <SubHeading>Students who could use a nudge</SubHeading> */}
    </>
  )
}

export default NotificationsPage