import { logRow } from '@/app/types'
import BodyText from '@/app/_ui_components/layout/BodyText'
import PracticeLogList from '@/app/_ui_components/object_display/PracticeLogList'
import Link from 'next/link'
import React from 'react'

function LogManager({logs}: {logs?: logRow[]}) {
  if (logs && logs.length == 0) {
          return <BodyText className="font-light">No logs yet</BodyText>
      }
  return (
    <>
        
        {logs && <PracticeLogList logs={logs} />}
        {logs && <Link href={`/students/${logs[0].student_id}/logs`} className='text-lighter underline block w-full text-right font-light text-sm p-2'>View Log History</Link>}
    </>
  )
}

export default LogManager