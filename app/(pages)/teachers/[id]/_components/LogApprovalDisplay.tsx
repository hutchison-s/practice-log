import BodyText from '@/app/_ui_components/layout/BodyText'
import { utcToTimeZone } from '@/app/_utils/dates'
import { ApprovalRequest } from '@/app/types'
import React from 'react'
import LogApprovalButtons from './LogApprovalButtons'

function LogApprovalDisplay({approval_request, onChoice}: {approval_request: ApprovalRequest, onChoice: (id: string)=>void}) {
  return (
    <li key={approval_request.id} className='glass p-2 rounded-xl w-full grid grid-cols-[1fr_60px_60px]'>
        <div>
            <h3 className='text-shadow-xl font-golos text-xl'><span className='font-bold'>{approval_request.student_name}</span> - {approval_request.estimated_time} minutes</h3>
            <BodyText className='text-md my-2'>{approval_request.reason}</BodyText>
            <p className='text-xs font-inter text-zinc-400'><small>{utcToTimeZone(approval_request.start_time)}</small></p>
        </div>
        <LogApprovalButtons approval_request={approval_request} log_id={approval_request.log_id} onClick={onChoice}/>
    </li>
  )
}

export default LogApprovalDisplay