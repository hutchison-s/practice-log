import { Resource } from '@/app/types'
import ResourceDisplay from '@/app/ui/components/ResourceDisplay'
import React from 'react'

function ResourceList({resources, onDelete}: {resources?: Resource[], onDelete: (id: string)=>void}) {
  return (
    <ul className="grid gap-2">
        {resources?.map(r => <ResourceDisplay key={r.id} r={r} onDelete={onDelete}/>)}
    </ul>
  )
}

export default ResourceList