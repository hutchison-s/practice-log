'use client'

import { NotificationSettings } from '@/app/types'
import { Loader } from 'lucide-react'
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'


const initialSettings: NotificationSettings = {
    messages: false,
    approvals: false,
    reports: false,
    report_frequency: 7
}

function NotificationOptions({teacher_id, userSettings}: {teacher_id: string, userSettings?: NotificationSettings}) {
    const [settings, setSettings] = useState<NotificationSettings>(userSettings || initialSettings)
    const [isLoading, setIsLoading] = useState(false);
    const changed = useRef<string>('all')


    const handleToggle: ChangeEventHandler<HTMLInputElement> = (e) => {
        const {name} = e.currentTarget;
        changed.current = name;
        setSettings(prev => {
            return {
                ...prev,
                [name]: !prev[name as keyof NotificationSettings]
            }
        })
    }

    const handleSelect: ChangeEventHandler<HTMLSelectElement> = (e)=>{
        const {name, value} = e.currentTarget
        changed.current = name;
        setSettings(prev => {
            return {
                ...prev,
                [name]: parseInt(value)
            }
        })
    }

    useEffect(()=>{
        setIsLoading(true)
        fetch(`/api/teachers/${teacher_id}/preferences`, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(settings)})
            .then(res => res.json())
            .then(json => {
                if (!json.data) {
                    console.error(json.message)
                }
            }).catch(err => console.error(err))
            .finally(()=>{setIsLoading(false); changed.current = 'none'})
    }, [settings])


  return (
    <>
        <div className="relative grid w-fit gap-2 mx-auto">
            <div className="flex w-full justify-start gap-2 p-2">
                {isLoading && changed.current == 'messages' || changed.current == 'all'
                    ? <Loader scale={1.5} className='spinner' />
                    : <input onChange={handleToggle} checked={settings.messages} type="checkbox" name="messages" id="messages"  className='m-2 scale-[150%] border-[1px] border-teal-500 bg-background accent-teal-500'/>
                }
                <label htmlFor="messages">Email me when a student sends me a message</label>
            </div>
            <div className="flex w-full justify-start gap-2 p-2">
                {isLoading && changed.current == 'approvals' || changed.current == 'all'
                    ? <Loader scale={1.5} className='spinner' />
                    : <input onChange={handleToggle} checked={settings.approvals} type="checkbox" name="approvals" id="approvals"  className='m-2 scale-[150%] border-[1px] border-teal-500 bg-background accent-teal-500'/>
                }
                <label htmlFor="approvals">Email me when a student sends a practice approval request</label>
            </div>
            <div className="flex w-full justify-start items-center gap-2 p-2">
                {isLoading && changed.current == 'reports' || changed.current == 'all'
                    ? <Loader scale={1.5} className='spinner' />
                    : <input onChange={handleToggle} checked={settings.reports} type="checkbox" name="reports" id="reports"  className='m-2 scale-[150%] border-[1px] border-teal-500 bg-background accent-teal-500'/>
                }
                <label htmlFor="reports" className=''>Email me practice reports</label>
                <select name="report_frequency" id="report_frequency" value={settings.report_frequency}  onChange={handleSelect} disabled={!settings.reports} aria-label='Report Frequency' className='p-2 rounded bg-background/75 text-white border-[1px] bordder-white/25'>
                    <option value={1}>Daily</option>
                    <option value={7}>Weekly</option>
                    <option value={30}>Monthly</option>
                </select>
            </div>
        </div>
        
    </>
  )
}

export default NotificationOptions