'use client'
import { EnrolleeWithCurrentWeekPractice, Group } from '@/app/types'
import { PrimaryButton, SecondaryButton } from '@/app/ui/components/Buttons'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useRef, useState } from 'react'

function AssignGroupButton({student, onAssign}: {student: EnrolleeWithCurrentWeekPractice, onAssign: (student_id: string, group_id: string | null, group_color?: string)=>void}) {
  const modalRef = useRef<HTMLDialogElement>(null)
      const formRef = useRef<HTMLFormElement>(null)
      const [groups, setGroups] = useState<Group[]>([])
      const [isOpen, setIsOpen] = useState(false);
      const [error, setError] = useState('');
      const router = useRouter();
  
      const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const selected = fd.get('group_id') as string;
          const group_id = selected == '0' ? null : selected;
          fetch(`/api/students/${student.id}`, {
              method: 'PATCH', 
              headers: {'content-type': 'application/json'}, 
              body: JSON.stringify({
                name: student.name, subject: student.subject, weeklyGoal: student.weekly_goal, dow: student.day_of_week, group_id: group_id
              })})
              .then(res => {
                if (res.ok) {
                  formRef.current?.reset();
                  console.log('submitted');
                  setIsOpen(false)
                  onAssign(student.id, group_id, groups.find(g => g.id == group_id)?.color);
                  router.refresh()
                }
              })
              .catch(err => {
                  console.error(err);
                  setError('Could not update group.')
              })
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

  return (
    <>
      <button
        onClick={()=>setIsOpen(true)} 
        className="w-8 h-full grid place-items-center rounded-l-lg border-[1px] border-white/25 border-r-transparent" style={{background: student.group_color}}>
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
              <select defaultValue={groups.find(g => g.id == student.group_id)?.id} name="group_id" id="group_id" className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-white p-2 w-full truncate rounded-xl">
                <option value={'0'}>No Group</option>
                {groups?.map(group => <option key={group.id} value={group.id} style={{background: group.color}}>{group.name}</option>)}
              </select>
          </label>
          {error && <p className='text-center text-sm my-2'>{error}</p>}
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