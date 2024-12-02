import { Resource } from '@/app/types';
import ResourceDisplay from '@/app/ui/components/ResourceDisplay';
import SubHeading from '@/app/ui/components/SubHeading';
import Link from 'next/link';
import React from 'react'

function ResourcesManager({resources, onDelete}: {resources?: Resource[], onDelete: (id: string)=>void}) {
    if (!resources) return <>Loading Resources...</>
    return (
       <>
            <SubHeading className="mb-1 mt-2">Resources</SubHeading>
            {resources?.map(r => <ResourceDisplay key={r.id} r={r} onDelete={onDelete}/>)}
            {resources.length > 2 && <Link href={`/students/${resources[0].student_id}/resources`} className='text-lighter underline block w-full text-right font-light text-sm p-2'>View All Resources</Link>}
       </>
    )
}

export default ResourcesManager