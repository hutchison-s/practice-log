'use client'
import { Enrollee, Group } from '@/app/types'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import { Users } from 'lucide-react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'

function AssignGroupButton({student, onAssign}: {student: Enrollee, onAssign: (s: Enrollee)=>void}) {
  const modalRef = useRef<HTMLDialogElement>(null)
      const formRef = useRef<HTMLFormElement>(null)
      const [groups, setGroups] = useState<Group[]>([])
      const [groupId, setGroupId] = useState<string | undefined>(undefined)
      const [isOpen, setIsOpen] = useState(false);
  
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const selected = fd.get('group_id') as string;
          const group_id = selected == '0' ? null : selected;
          const res = await fetch(`/api/students/${student.id}`, {
              method: 'PATCH', 
              headers: {'content-type': 'application/json'}, 
              body: JSON.stringify({
                name: student.name, 
                subject: student.subject, 
                weeklyGoal: student.weekly_goal, 
                time_of_day: student.time_of_day, 
                duration: student.duration, 
                dow: student.day_of_week, 
                group_id: group_id
              })})
          if (!res.ok) {
            alert('Error occured while trying to update group assignment.')
          }
          const {data} = await res.json();
          formRef.current?.reset();
          setIsOpen(false)
          onAssign({...data, group_color: groups.find(g => g.id == selected)?.color || '#000000'});
      }
  
      const handleCancel = ()=>{
          formRef.current?.reset();
          setIsOpen(false);
      }
  
      useEffect(()=>{
          const populateGroups = async () => {
            fetch(`/api/teachers/${student.teacher_id}/groups`)
            .then(res => res.json())
            .then(json => {
              setGroups([...json.data])
              modalRef.current?.showModal();
            })
            .catch(err => console.error(err))
          }
          if (isOpen) {
              populateGroups();
          } else {
              modalRef.current?.close();
          }
      }, [isOpen])

      useEffect(()=>{
        setGroupId(student?.group_id || '0')
    }, [student?.group_id])

  return (
    <>
      <button
        onClick={()=>setIsOpen(true)} 
        className="w-8 h-full grid place-items-center rounded-l-lg border-[1px] border-white/25 border-r-transparent shadow-[0_0_8px_#00000055_inset]" style={{backgroundImage: `linear-gradient(-45deg, ${student.group_color}55, ${student.group_color})`}}>
        <Users size={12}/>
      </button>
      <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
        <form onSubmit={handleSubmit} ref={formRef} className="grid gap-4">
          <label className="relative mt-8 block w-full rounded group">
            <span 
                className="bg-transparent"
            >
              Assign {student.name} to a group:
            </span>
            <select value={groupId} onChange={(e)=>{setGroupId(e.target.value)}} name="group_id" id="group_id" className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-white p-2 w-full truncate rounded-xl">
              <option value={'0'}>No Group</option>
              {groups?.map(group => <option key={group.id} value={group.id} style={{background: group.color}}>{group.name}</option>)}
            </select>
          </label>
          <div className="flex gap-4 justify-evenly items-center">
              <PrimaryButton type='submit' className='text-sm px-4' onClick={()=>null}>Assign</PrimaryButton>
              <SecondaryButton type='button' className='text-sm px-4' onClick={handleCancel}>Cancel</SecondaryButton>
          </div>
        </form>
      </dialog>
    </>
  )
}

export default AssignGroupButton