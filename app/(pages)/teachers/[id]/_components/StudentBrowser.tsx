'use client';

import useStudentBrowser from "@/app/_hooks/useStudentBrowser";
import { Enrollee, Group } from "@/app/types";
import { SecondaryLinkButton } from "@/app/_ui_components/layout/Buttons";
import NewStudentButton from "@/app/(pages)/teachers/[id]/_components/NewStudentButton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditGroupButton from "./EditGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import NewGroupButton from "./NewGroupButton";
import StudentList from "./StudentList";
import StudentRecordsPanel from "./StudentRecordsPanel";
import FeaturedText from "@/app/_ui_components/layout/FeaturedText";
import { Calendar, List } from "lucide-react";
import StudentDetailsHeader from "./StudentDetailsHeader";
import StudentScheduleList from "./StudentScheduleList";

function StudentBrowser({ students, groups, teacher_id }: { students: Enrollee[], groups: Group[], teacher_id: string }) {
  const searchParams = useSearchParams();
  const initialSelected = searchParams.get('student');
  const [isLoading, setIsLoading] = useState(false);
  const {state, logController, goalController, resourceController, studentDetailsController, studentListController, groupController} = useStudentBrowser({studentList: students, groups: groups, activeStudentDetails: null})
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialSelected)
  const [selectedStudent, setSelectedStudent] = useState<Enrollee | null>(null);
  const [activeGroupId, setActiveGroupId] = useState('0');
  const [isListView, setIsListView] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState<Enrollee[]>(students);

  const findActive = ()=>{
    return state.studentList.find(s=>s.id==selectedStudentId) || null;
  }

  const updateFiltered = ()=>{
    setFilteredStudents(prev => [...state.studentList.filter(s => {
      console.log(prev.length)
      return activeGroupId == '0' || s.group_id == activeGroupId
    })])
  }

  useEffect(()=>{
      updateFiltered();
  }, [activeGroupId, state.studentList])


  const handleDeleteGroup = (group_id: string) => {
    const targetGroup = state.groups.find(g => g.id == group_id);
    if (!targetGroup) return;
    setActiveGroupId('0');
    groupController.delete(targetGroup)
  }

  const handleDeleteStudent = (s: Enrollee)=>{
    setSelectedStudentId(null);
    studentListController.delete(s);
  }

  const handleDeselect = (target: HTMLElement)=>{
    if (target.tagName == 'MAIN' || target.id == 'studentList') {
      setSelectedStudentId(null)
      studentDetailsController.clear()
    }
  }

  const handleClick = (e: MouseEvent) => {
    handleDeselect(e.target as HTMLElement)
  }
  const handleTouch = (e: TouchEvent) => {
    handleDeselect(e.touches[0].target as HTMLElement)
  }

  useEffect(()=>{
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouch)

    return ()=>{
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  useEffect(()=>{
    setSelectedStudent(findActive())
  }, [selectedStudentId])

  return (
    <>
    <div className="flex justify-evenly w-full flex-wrap gap-2">
        <SecondaryLinkButton href={`/teachers/${teacher_id}/reports/weekly_logs?view=table`} className="text-center my-1 md:min-w-[30%]">View Reports</SecondaryLinkButton>
        <NewStudentButton teacher_id={teacher_id} onCreate={studentListController.add} />
        <SecondaryLinkButton href={`/teachers/${teacher_id}/qr-codes`} className="text-center my-1 md:min-w-[30%]">View All QR Codes</SecondaryLinkButton>
    </div>
    <div className="relative w-full max-w-[1000px] justify-items-center grid grid-cols-1 lg:grid-cols-5">
      <div className="lg:col-span-5 w-full max-w-[500px] mx-auto flex items-center justify-start gap-2 my-2">
        <label htmlFor="filter" className="text-zinc-400 text-lg">Group:</label>
        <select name="filter" id="filter" value={activeGroupId} onChange={(e)=>setActiveGroupId(e.target.value)} className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-white p-2 w-full truncate rounded-xl">
          <option value={'0'}>All Students</option>
          {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <EditGroupButton onUpdate={groupController.update} groupId={activeGroupId == '0' ? undefined : activeGroupId} teacher_id={teacher_id}/>
        <DeleteGroupButton onDelete={handleDeleteGroup} groupId={activeGroupId == '0' ? undefined : activeGroupId} teacher_id={teacher_id} />
        <NewGroupButton teacher_id={teacher_id} onCreate={groupController.add}/>
      </div>
      <div className="w-full lg:col-span-5 pl-2">
        <button className="border-[1px] border-white/25 px-3 py-1 rounded-l" style={{backgroundImage: isListView ? 'linear-gradient(135deg, #3730a3, #1e1b4b)' : 'none'}} onClick={()=>setIsListView(true)}><List aria-label="List View"/></button>
        <button className="border-[1px] border-white/25 px-3 py-1 rounded-r" style={{backgroundImage: isListView ? 'none' : 'linear-gradient(135deg, #3730a3, #1e1b4b)'}} onClick={()=>setIsListView(false)}><Calendar aria-label="Schedule View"/></button>
      </div>
      {isListView
        ? <StudentList
            students={filteredStudents}
            disabled={isLoading}
            onSelect={(student_id: string) => {
              if (isLoading) return;
              setIsLoading(true);
              setSelectedStudentId(student_id);
              setIsLoading(false);
            }}
            onUpdate={(s: Enrollee)=>{
              setIsLoading(true);
              studentListController.update(s);
              setSelectedStudentId(s.id);
              setSelectedStudent(s);
              setIsLoading(false);
            }}
            selected={selectedStudentId}
          />
        : <StudentScheduleList 
            students={filteredStudents}
            disabled={isLoading} 
            onSelect={(student_id: string) => {
              if (isLoading) return;
              setIsLoading(true);
              setSelectedStudentId(student_id);
              setIsLoading(false);
            }
          }/>
      }
      <section className="w-full col-span-1 lg:col-span-2 lg:max-w-[600px] max-w-full glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none">
      {selectedStudent
          ? <>
              <StudentDetailsHeader student={selectedStudent} onUpdate={
                (s: Enrollee)=>{
                  studentListController.update(s);
                  setSelectedStudentId(s.id);
                  setSelectedStudent(s);
                }
              } onDelete={handleDeleteStudent} />
              <StudentRecordsPanel student_id={selectedStudent.id} records={state.activeStudentDetails} recordsController={studentDetailsController} logController={logController} goalController={goalController} resourceController={resourceController}/>
            </>
          : <FeaturedText className="text-center my-4 px-8">Select a student to view info</FeaturedText>
      }</section>
    </div>
    </>
  );
}

export default StudentBrowser;
