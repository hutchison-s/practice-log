'use client'

import { ApprovalRequest } from '@/app/types'
import React, { useState } from 'react'
import LogApprovalDisplay from './LogApprovalDisplay'

function LogApprovalManager({requests}: {requests: ApprovalRequest[]}) {
    const [reqList, setReqList] = useState<ApprovalRequest[]>(requests);
    
  return (
    <ul className='grid gap-2 w-full max-w-[600px] mx-auto'>
        {reqList.map(a => <LogApprovalDisplay approval_request={a} key={a.id} onChoice={(id: string)=>{setReqList(prev => [...prev.filter(each => each.id != id)])}}/>)}
    </ul>
  )
}

export default LogApprovalManager