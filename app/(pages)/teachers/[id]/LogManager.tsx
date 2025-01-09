import { logRow } from '@/app/types'
import PracticeLogList from '@/app/ui/components/PracticeLogList'
import Link from 'next/link'
import React from 'react'

function LogManager({logs}: {logs?: logRow[]}) {
  if (!logs) return <p>Loading Logs...</p>
  return (
    <>
        
        {logs && <PracticeLogList logs={logs} />}
        {logs && logs.length > 2 && <Link href={`/students/${logs[0].student_id}/logs`} className='text-lighter underline block w-full text-right font-light text-sm p-2'>View Log History</Link>}
    </>
  )
}

export default LogManager