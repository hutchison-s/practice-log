import PrintableQRCode from '@/app/(pages)/students/[id]/qr_code/PrintableQRCode';
import { fetchJSONWithToken } from '@/app/AuthHandler';
import { EnrolleeWithCurrentWeekPractice } from '@/app/types';
import PrintButton from '@/app/ui/components/PrintButton';

import React from 'react'



async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const students = await fetchJSONWithToken<EnrolleeWithCurrentWeekPractice[]>(`${apiURL}/teachers/${id}/students`);
  return (
    <>
    <div className="w-full flex justify-end print:hidden">
        <PrintButton/>
    </div>
        <section className='w-full flex flex-wrap justify-center print:justify-start'>
            {students.data?.map(s => 
                <div 
                    className='border-2 border-dashed border-black p-2 -mx-[1px] -my-[1px]' 
                    key={s.id}><PrintableQRCode course={s.subject} 
                    imageURL={`${apiURL}/students/${s.id}/qr_code?code=${s.code}&time=${new Date(s.created_at).getTime()}&width=200`} 
                    name={s.name} 
                    width={200}/>
                </div>)}
        </section>   
    </>
  )
}

export default Page