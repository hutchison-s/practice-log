'use client'

import { ApprovalRequest } from '@/app/types'
import { CircleCheck, XCircle } from 'lucide-react'
import React from 'react'

function LogApprovalButtons({approval_request, onClick}: {approval_request: ApprovalRequest, log_id: string, onClick: (id: string)=>void}) {
    const handleApprove = ()=>{
        updateRequest(true)
            .then(()=>onClick(approval_request.id))
            .catch(err => console.error(err))
    }
    const handleDecline = ()=>{
        updateRequest(false)
            .then(()=>onClick(approval_request.id))
            .catch(err => console.error(err))
    }
    const updateRequest = (is_approved: boolean) => {
        return fetch(`/api/teachers/${approval_request.teacher_id}/approval_requests/${approval_request.id}`, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({is_approved})})
    }
  return (
    <>
        <button onClick={handleApprove} className=''><CircleCheck size={40} aria-label='Approve' className='text-teal-500 text-shadow rounded-full transition-all hover:scale-105 hover:shadow-xl'/></button>
        <button onClick={handleDecline} className=''><XCircle size={40} aria-label='Reject' className='text-red-500 text-shadow rounded-full transition-all hover:scale-105 hover:shadow-xl'/></button>
    </>
  )
}

export default LogApprovalButtons