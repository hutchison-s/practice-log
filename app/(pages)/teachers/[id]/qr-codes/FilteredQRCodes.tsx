'use client'

import PrintableQRCode from '@/app/(pages)/students/[id]/qr_code/PrintableQRCode'
import { Enrollee, Group } from '@/app/types'
import React, { useState } from 'react'

function FilteredQRCodes({students, groups}: {students: Enrollee[], groups: Group[]}) {
    const [filterId, setFilterId] = useState('all');
  
    return (
        <>
        <label className="relative mt-8 block w-full rounded group">
              <span 
                  className="bg-transparent"
              >
                  Filter By Group:
              </span>
              <select onChange={(e)=>setFilterId(e.target.value)} defaultValue='all' name="group_id" id="group_id" className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-white p-2 w-full truncate rounded-xl">
                <option value='all'>All Students</option>
                {groups?.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
              </select>
          </label>
        <section className='w-full flex flex-wrap justify-center print:justify-start'>
            {students?.filter(s => {if (filterId == 'all') return true; return s.group_id == filterId}).map(s => 
                <div 
                    className='border-2 border-dashed border-white/25 print:border-black p-2 -mx-[1px] -my-[1px]' 
                    key={s.id}><PrintableQRCode course={s.subject} 
                    imageURL={`/api/students/${s.id}/qr_code?code=${s.code}&time=${new Date(s.created_at).getTime()}&width=150`} 
                    name={s.name} 
                    width={150}/>
                </div>)}
        </section>
        </>
  )
}

export default FilteredQRCodes