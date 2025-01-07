import { Resource } from '@/app/types';
import Link from 'next/link';
import React from 'react'
import ResourceList from './ResourceList';

function ResourcesManager({resources, onDelete}: {resources?: Resource[], onDelete: (id: string)=>void}) {
    if (!resources) return <>Loading Resources...</>
    return (
       <>
            {resources && <ResourceList resources={resources} onDelete={onDelete}/>}
            {resources.length > 2 && <Link href={`/students/${resources[0].student_id}/resources`} className='text-lighter underline block w-full text-right font-light text-sm p-2'>View All Resources</Link>}
       </>
    )
}

export default ResourcesManager