import { fetchJSONWithToken } from '@/app/_utils/AuthHandler';
import { ApprovalRequest } from '@/app/types';
import { CircleAlert } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

async function NotificationAlert({teacher_id}: {teacher_id: string}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const {data: approval_requests} = await fetchJSONWithToken<ApprovalRequest[]>(`${apiURL}/teachers/${teacher_id}/approval_requests`);
  return (
    approval_requests 
        && approval_requests.length > 0 
        && <Link 
                href={`/teachers/${teacher_id}/notifications`} 
                className="px-2 py-1 rounded flex items-center gap-1 bg-white border-2 border-teal-500 text-background animate-bounce"
            >
                Practice Approval Needed <CircleAlert className="text-red-500" aria-label='Notification Alert'/>
            </Link>
  )
}

export default NotificationAlert