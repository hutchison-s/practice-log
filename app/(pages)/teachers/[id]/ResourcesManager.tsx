import { Resource } from '@/app/types';
import ResourceDisplay from '@/app/ui/components/ResourceDisplay';
import SubHeading from '@/app/ui/components/SubHeading';
import React from 'react'

function ResourcesManager({resources, onDelete}: {resources?: Resource[], onDelete: (id: string)=>void}) {
    if (!resources) return <>Loading Resources...</>
    return (
       <>
            <SubHeading className="mb-1 mt-2">Resources</SubHeading>
            {resources?.map(r => <ResourceDisplay key={r.id} r={r} onDelete={onDelete}/>)}
            
       </>
    )
}

export default ResourcesManager