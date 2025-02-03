'use client'
import { Enrollee, Group } from '@/app/types'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import { Users } from 'lucide-react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Students } from '@/app/api/_controllers/studentController'
import { Groups } from '@/app/api/_controllers/tableControllers'

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
          const updatedStudent = await Students.updateOne(student.id, {
              name: student.name, 
              subject: student.subject, 
              weekly_goal: student.weekly_goal, 
              time_of_day: student.time_of_day, 
              duration: student.duration, 
              day_of_week: student.day_of_week, 
              group_id: group_id
          })
          if (!updatedStudent) {
            alert('Error occured while trying to update group assignment.')
          }
          formRef.current?.reset();
          setIsOpen(false)
          onAssign({...updatedStudent, group_color: groups.find(g => g.id == selected)?.color || '#000000'});
      }
  
      const handleCancel = ()=>{
          formRef.current?.reset();
          setIsOpen(false);
      }
  
      useEffect(()=>{
          const populateGroups = async () => {
            Groups(student.teacher_id).getAll()
            .then(gList => {
              setGroups([...gList])
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