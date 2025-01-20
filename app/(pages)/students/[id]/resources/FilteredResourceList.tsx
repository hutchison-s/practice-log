'use client'

import NewResourceButton from '@/app/(pages)/teachers/[id]/_components/NewResourceButton';
import { useUser } from '@/app/_hooks/useUser';
import ResourceList from '@/app/_ui_components/object_display/ResourceList';
import { Resource } from '@/app/types'
import React, { useState } from 'react'

function FilteredResourceList({student_id, resources}: {student_id: string, resources: Resource[]}) {
    const [filteredResources, setFilteredResources] = useState(resources);
    const {user} = useUser()
  return (
    <>
        {user && user.role == 'teacher' && <NewResourceButton student_id={student_id} onCreate={(r: Resource)=>setFilteredResources(prev => [r, ...prev])}/>}
        <ResourceList resources={filteredResources} onDelete={(id: string)=>setFilteredResources(prev => [...prev.filter(each => each.id != id)])} />
    </>
  )
}

export default FilteredResourceList