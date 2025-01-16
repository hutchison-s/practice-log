'use client';

import { useEffect, useReducer, useState } from "react";
import StudentList from "./StudentList";
import StudentManager from "./StudentManager";
import { Enrollee, EnrolleeWithCurrentWeekPractice, Group } from "@/app/types";
import { getDetails } from "./actions";
import { reducer } from "@/app/_activeStudentReducer/activeStudentReducer";
import Elipsis from "@/app/ui/components/Elipsis";
import NewGroupButton from "./NewGroupButton";
import EditGroupButton from "./EditGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import { useSearchParams } from "next/navigation";
import StudentScheduleList from "./StudentScheduleList";
import { Calendar, List } from "lucide-react";
import { studentListReducer } from "@/app/_studentListReducer/studentListReducer";
import NewStudentButton from "@/app/ui/components/NewStudentButton";
import { SecondaryLinkButton } from "@/app/ui/components/Buttons";

function StudentBrowser({ students, teacher_id }: { students: EnrolleeWithCurrentWeekPractice[], teacher_id: string }) {
  const searchParams = useSearchParams();
  const initialSelected = searchParams.get('student');
  const [state, dispatch] = useReducer(reducer, undefined);
  const [studentList, dispatchStudentList] = useReducer(studentListReducer, students)
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState('0');
  const [activeGroup, setActiveGroup] = useState<Group>()
  const [isListView, setIsListView] = useState(true);
  const [filtered, setFiltered] = useState<EnrolleeWithCurrentWeekPractice[]>(students)

  useEffect(() => {
    const init = async (student?: EnrolleeWithCurrentWeekPractice) => {
        if (!student) return;
        const data = await getDetails(student.id, student.created_at, student.day_of_week);
        if (!data) {
          dispatch({ type: "CLEAR_DETAILS" });
          return;
        }
        const { logs, goals, resources, time, nextLessonDay } = data;
        dispatch({
          type: "SET_DETAILS",
          payload: {
            logs: logs || [],
            goals: goals || [],
            resources: resources || [],
            time,
            nextLessonDay,
            student,
            isLoading: false
          },
        });
    };
    if (state?.student) {
      init(state.student);
    } else {
      dispatch({ type: "CLEAR_DETAILS" });
    }
  }, [state?.student]);

  useEffect(()=>{
      setFiltered(prev => [...studentList?.filter(s => {
        console.log(prev.length)
        return groupId == '0' || s.group_id == groupId
      })])
    dispatch({type: 'CLEAR_DETAILS'})
    setActiveGroup(groups.find(g => g.id == groupId))
  }, [groupId, studentList])

  const handleNewGroup = (g: Group) => {
    if (!groups) {
      setGroups([g])
    } else {
      setGroups(prev => [...prev, g])
    }
  }

  const handleEditGroup = (g: Group) => {
    setGroups(prev => {
      return [...prev.map(each => each.id == g.id ? g : each)]
    })
    dispatchStudentList({type: 'UPDATE_ALL', payload: [...students.map(s => s.group_id == g.id ? {...s, group_color: g.color} : {...s})]})
  }

  const handleDeleteGroup = (g: Group) => {
    dispatch({type: 'CLEAR_DETAILS'});
    dispatchStudentList({type: 'UPDATE_ALL', payload: [...students.map(s => s.group_id == g.id ? {...s, group_id: null, group_color: '#000000'} : {...s})]})
    setGroupId('0');
    setGroups(prev => prev.filter(each => each.id !== g.id))
  }

  const handleDeselect = (target: HTMLElement)=>{
    if (target.tagName == 'MAIN' || target.id == 'studentList') {
      dispatch({type: "CLEAR_DETAILS"})
    }
  }

  const handleDeleteStudent = (id: string) => {
    dispatch({ type: "SET_SELECTED_STUDENT", payload: undefined });
    dispatchStudentList({type: 'DELETE_STUDENT', payload: id})
  }
  const handleAddStudent = (student: Enrollee) => {
    dispatchStudentList({type: 'ADD_STUDENT', payload: {...student, current_week_minutes: 0}})
  }
  const handleUpdateStudent = (student: EnrolleeWithCurrentWeekPractice) => {
    console.log('updating to', student)
    dispatchStudentList({type: 'MODIFY_STUDENT', payload: {...student, group_color: student.group_id == '0' ? '#000000' : groups.find(g => g.id == student.group_id)!.color}});
  }

  const handleClick = (e: MouseEvent) => {
    handleDeselect(e.target as HTMLElement)
  }
  const handleTouch = (e: TouchEvent) => {
    handleDeselect(e.touches[0].target as HTMLElement)
  }

  useEffect(()=>{
    fetch(`/api/teachers/${teacher_id}/groups`)
      .then(res => res.json())
      .then(json => {
        setGroups(json.data)
      }).catch(err => {
        console.error(err)
      })
  }, [])

  useEffect(()=>{
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouch)

    return ()=>{
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  useEffect(()=>{
    if (initialSelected) {
      dispatch({type: 'SET_SELECTED_STUDENT', payload: students.find(s => s.id == initialSelected)})
    }
  }, [])

  return (
    <>
    <div className="flex justify-evenly w-full flex-wrap gap-2">
        <NewStudentButton teacher_id={teacher_id} onCreate={handleAddStudent}/>
        <SecondaryLinkButton href={`/teachers/${teacher_id}/qr-codes`} className="text-center my-1">View All QR Codes</SecondaryLinkButton>
    </div>
    <div className="relative w-full max-w-[1000px] justify-items-center grid grid-cols-1 lg:grid-cols-2">
      <div className="lg:col-span-2 w-full max-w-[500px] mx-auto flex items-center justify-start gap-2 my-2">
        <label htmlFor="filter" className="text-zinc-400 text-lg">Group:</label>
        <select name="filter" id="filter" value={groupId} onChange={(e)=>setGroupId(e.target.value)} className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-white p-2 w-full truncate rounded-xl">
          <option value={'0'}>All Students</option>
          {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <EditGroupButton onUpdate={handleEditGroup} group={activeGroup} teacher_id={teacher_id}/>
        <DeleteGroupButton onDelete={handleDeleteGroup} group={activeGroup} teacher_id={teacher_id} />
        <NewGroupButton teacher_id={teacher_id} onCreate={handleNewGroup}/>
      </div>
      <div className="w-full md:col-span-2 pl-2">
        <button className="border-[1px] border-white/25 px-3 py-1 rounded-l" style={{backgroundImage: isListView ? 'linear-gradient(135deg, #3730a3, #1e1b4b)' : 'none'}} onClick={()=>setIsListView(true)}><List /></button>
        <button className="border-[1px] border-white/25 px-3 py-1 rounded-r" style={{backgroundImage: isListView ? 'none' : 'linear-gradient(135deg, #3730a3, #1e1b4b)'}} onClick={()=>setIsListView(false)}><Calendar /></button>
      </div>
      {isListView
        ? <StudentList
            students={filtered}
            disabled={state?.isLoading}
            setSelected={(student) => {
              if (student !== state?.student) {
                dispatch({ type: "SET_SELECTED_STUDENT", payload: student })}
              }
            }
            selected={state?.student}
          />
        : <StudentScheduleList studentList={filtered} onSelect={(student) => {
              if (student !== state?.student) {
                dispatch({ type: "SET_SELECTED_STUDENT", payload: student })}
              }
          }/>
      }
      {state?.isLoading
        ? <div className="w-full max-w-[600px] glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none text-zinc-400 font-inter font-light grid place-items-center text-2xl">
          <p>Gathering Info<Elipsis /></p>
          </div>
        : <StudentManager
        details={state}
        dispatch={dispatch}
        onDelete={handleDeleteStudent}
        onEdit={handleUpdateStudent}
      />}
    </div>
    </>
  );
}

export default StudentBrowser;
