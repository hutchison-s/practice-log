import { Resource } from '@/app/types'
import BodyText from '@/app/_ui_components/layout/BodyText'
import ResourceDisplay from '@/app/_ui_components/object_display/ResourceDisplay'
import React from 'react'

function ResourceList({resources, onDelete}: {resources?: Resource[], onDelete?: (id: string)=>void}) {
  if (resources && resources.length == 0) {
    return <BodyText>No resources yet</BodyText>
  }
  return (
    <ul className="grid gap-2 w-full max-w-[600px] mx-auto">
        {resources?.map(r => <ResourceDisplay key={r.id} r={r} onDelete={onDelete}/>)}
    </ul>
  )
}

export default ResourceList