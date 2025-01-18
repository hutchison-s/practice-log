import { Resource } from '@/app/types'
import BodyText from '@/app/ui/components/BodyText'
import ResourceDisplay from '@/app/ui/components/ResourceDisplay'
import StudentResourceDisplay from '@/app/ui/components/StudentResourceDisplay'
import React from 'react'

function ResourceList({resources, onDelete, isStudentView}: {resources?: Resource[], onDelete?: (id: string)=>void, isStudentView?: boolean}) {
  if (resources && resources.length == 0) {
    return <BodyText>No resources yet</BodyText>
  }
  return (
    <ul className="grid gap-2 w-full max-w-[600px] mx-auto">
        {resources?.map(r => {
          if (isStudentView) {
            return <StudentResourceDisplay key={r.id} r={r} />
          } else if (onDelete) {
            return <ResourceDisplay key={r.id} r={r} onDelete={onDelete}/>
          }
})}
    </ul>
  )
}

export default ResourceList